from django.http import Http404
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from inventory_item.serializers import ItemSerializer
from .serializers import GetAuditSerializer, GetBinToSKSerializer, \
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
        factory = SKPermissionFactory(self.request)
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
        org_id = request.query_params.get('organization', -1)
        audit_status = request.query_params.get('status')
        assigned_sk = request.query_params.get('assigned_sk')

        if audit_status:
            self.queryset = self.queryset.filter(status=audit_status)
        if assigned_sk:
            self.queryset = self.queryset.filter(assigned_sk__id=assigned_sk)
        self.queryset = self.queryset.filter(organization_id=org_id)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Audit Progression Metrics')
    def progression_metrics(self, request):
        audit_id = request.query_params.get('audit_id', -1)
        try:
            audit = Audit.objects.get(audit_id=audit_id)
            total_items_to_audit = audit.inventory_items.count()
            completed_items = Record.objects.filter(audit=audit_id).count()
            new_items = Record.objects.filter(status='New').count()
        except ObjectDoesNotExist as ex:
            raise Http404 from ex
            
        remaining_items = total_items_to_audit - (completed_items - new_items)
        percent_complete = 0.0 if total_items_to_audit == 0 else ((completed_items / total_items_to_audit) * 100)
        percent_complete = round(percent_complete, 2)
        audit_accuracy = round(audit.accuracy * 100, 2)

        metrics_report = {
            'completed_items' : completed_items,
            'remaining_items' :  remaining_items,
            'completion_percentage' : percent_complete,
            'accuracy' : audit_accuracy
        }
        return Response(metrics_report, status=status.HTTP_200_OK)


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
    http_method_names = ['post', 'get', 'patch', 'delete']
    queryset = BinToSK.objects.all()

    def get_permissions(self):
        factory = SKPermissionFactory(self.request)
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
        bin_status = request.query_params.get('status')
        init_audit_id = request.query_params.get('init_audit_id', -1)

        if bin_status:
            self.queryset = self.queryset.filter(status=bin_status)
        if customuser_id:
            self.queryset = self.queryset.filter(customuser_id=customuser_id)
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
        factory = SKPermissionFactory(self.request)
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

    def dispatch(self, request, *args, **kwargs):
        response = super().dispatch(request, *args, **kwargs)
        if response.data:
            if 'audit' in response.data:
                set_audit_accuracy(response.data['audit'])
        return self.response

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
        bin_id = request.query_params.get('bin_id', -1)
        audit_id = request.query_params.get('audit_id', -1)
        item_id = request.query_params.get('item_id', -1)
        response = Response(status=status.HTTP_400_BAD_REQUEST)

        try:  # Check that the item exists for this Audit
            bins = BinToSK.objects.get(bin_id=bin_id)
            audit = Audit.objects.get(audit_id=audit_id)
            item = audit.inventory_items.get(_id=item_id)
        except (ObjectDoesNotExist, ValueError) as ex:
            raise Http404 from ex

        record = {}
        try:  # Check that the item hasn't already been recorded
            audit_records = Record.objects.filter(audit=audit_id)
            record = audit_records.get(item_id=item_id)
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
