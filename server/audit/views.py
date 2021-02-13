from django.http import Http404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from user_account.permissions import HasSameOrgInQuery, \
    PermissionFactory
from inventory_item.serializers import ItemSerializer
from .serializers import AuditSerializer, GetAuditSerializer, GetBinToSKSerializer, \
    PostBinToSKSerializer, RecordSerializer
from .permissions import *
from .models import Audit, BinToSK, Record


class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get', 'delete']
    queryset = Audit.objects.all()

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions(
                im_additional_perms=[CheckAuditOrganizationById, ValidateSKOfSameOrg],
                sk_additional_perms=[IsAssignedToAudit]
        )
        return [permission() for permission in permission_classes]

    def get_serializer(self, *args, **kwargs):
        serializer_class = AuditSerializer
        if self.action in ['list', 'retrieve']:
            serializer_class = GetAuditSerializer
        return serializer_class(*args, **kwargs)

    def list(self, request):
        org_id = request.query_params.get('organization')
        audit_status = request.query_params.get('status')
        assigned_sk = request.query_params.get('assigned_sk')

        if audit_status:
            self.queryset = self.queryset.filter(status=audit_status)
        if org_id:
            self.queryset = self.queryset.filter(organization_id=org_id)
        if assigned_sk:
            self.queryset = self.queryset.filter(assigned_sk__id=assigned_sk)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)


def set_audit_accuracy(audit_id):
    audit = Audit.objects.get(audit_id=audit_id)
    records = Record.objects.filter(audit=audit_id)

    missing = records.filter(status='Missing').count()
    found = records.filter(status='Provided').count()
    total_records_no_new = found + missing

    audit_accuracy = 0.0 if total_records_no_new == 0 else found / total_records_no_new
    setattr(audit, 'accuracy', audit_accuracy)
    audit.save()


def get_item_serializer(*args, **kwargs): # pylint: disable=no-self-use
    serializer_class = ItemSerializer
    return serializer_class(*args, **kwargs)


class BinToSKViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'get', 'delete']
    queryset = BinToSK.objects.all()

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions(
            im_additional_perms=[CheckAuditOrganizationById, ValidateSKOfSameOrg],
            sk_additional_perms=[IsAssignedToBin]
        )
        return [permission() for permission in permission_classes]

    def get_serializer(self, *args, **kwargs):
        serializer_class = GetBinToSKSerializer
        if self.request.method != 'GET':
            serializer_class = PostBinToSKSerializer
        return serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        saved_audit = serializer.save()
        if not saved_audit:
            return Response({'error': 'failed'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request):
        customuser_id = request.query_params.get('customuser_id')
        init_audit_id = request.query_params.get('init_audit_id')

        if customuser_id:
            self.queryset = self.queryset.filter(customuser_id=customuser_id)
        if init_audit_id:
            self.queryset = self.queryset.filter(init_audit_id=init_audit_id)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Get Items In Bin')
    def items(self, request):
        bin_id = request.query_params.get('bin_id')
        audit_id = request.query_params.get('audit_id')
        bins = BinToSK.objects.get(bin_id=bin_id)
        queryset = Audit.objects.get(audit_id=audit_id)
        records = Record.objects.filter(bin_to_sk_id=bin_id).all()
        completed_items = [record.item_id for record in records]
        bin_items = []
        for item in queryset.inventory_items.all():
            if int(item._id) in bins.item_ids and int(item._id) not in completed_items:
                bin_items.append(item)
        serializer = get_item_serializer(bin_items, many=True)
        return Response(serializer.data)


class RecordViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', 'get', 'patch', 'delete']
    queryset = Record.objects.all()

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        if self.request.method == 'GET':
            sk_perms = [IsAssignedToBin]
        elif self.request.method in ['PATCH', 'DELETE']:
            sk_perms = [IsAssignedToRecord]
        else:
            sk_perms = [CanCreateRecord]
        permission_classes = factory.get_general_permissions(
            im_additional_perms=[ValidateSKOfSameOrg],
            sk_additional_perms=sk_perms
        )
        return [permission() for permission in permission_classes]

    def get_serializer(self, *args, **kwargs):
        serializer_class = RecordSerializer
        return serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        record = serializer.save()
        if not record:
            return Response({'error': 'failed'}, status=status.HTTP_400_BAD_REQUEST)
        set_audit_accuracy(record.audit.audit_id)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs): # pylint: disable=unused-argument
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        set_audit_accuracy(instance.audit.audit_id)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs): # pylint: disable=unused-argument
        instance = self.get_object()
        self.perform_destroy(instance)
        set_audit_accuracy(instance.audit.audit_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['GET'], name='Get Completed Items')
    def completed_items(self, request):
        params = list(request.GET.keys())
        for bad_key in ['page', 'page_size', 'customuser_id']:
            if bad_key in params:
                params.remove(bad_key)
        for key in params:
            self.queryset = self.queryset.filter(**{key: request.GET.get(key)})
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    # pylint: disable=protected-access
    @action(detail=False, methods=['GET'], name='Check Item for Validation')
    def check_item(self, request):
        bin_id = request.query_params.get('bin_id')
        audit_id = request.query_params.get('audit_id')
        item_id = request.query_params.get('item_id')
        response = Response(status=status.HTTP_400_BAD_REQUEST)

        try:  # Check that the item exists for this Audit
            bins = BinToSK.objects.get(bin_id=bin_id)
            audit = Audit.objects.get(audit_id=audit_id)
            item = audit.inventory_items.get(_id=item_id)
        except (ObjectDoesNotExist, ValueError) as ex:
            raise Http404 from ex

        record = {}
        try:  # Check that the item hasn't already been recorded
            record = Record.objects.get(item_id=item_id)
        except ObjectDoesNotExist:
            if item._id in bins.item_ids:  # Check that the item belongs to the current bin
                serializer = get_item_serializer(item, many=False)
                response = Response(serializer.data)
            else:
                response = Response({
                    'detail': 'Item part of Audit but not of Bin',
                    'inAudit': audit_id}, status=status.HTTP_400_BAD_REQUEST)

        if record and str(record.audit.audit_id) == str(audit_id):
            response = Response({
                'detail': 'This item has already been completed',
                'alreadyMatched': record.record_id},
                status=status.HTTP_400_BAD_REQUEST)

        return response
