from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action

from django_server.custom_logging import LoggingViewset
from inventory_item.serializers import ItemSerializer
from .serializers import GetAuditSerializer, GetBinToSKSerializer, \
    PostBinToSKSerializer, RecordSerializer, AuditSerializer, ProperAuditSerializer
from .permissions import SKPermissionFactory, CheckAuditOrganizationById, \
        ValidateSKOfSameOrg, IsAssignedToBin, IsAssignedToAudit, \
            IsAssignedToRecord, CanCreateRecord
from .models import Audit, BinToSK, Record


class AuditViewSet(LoggingViewset):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get', 'delete']
    queryset = Audit.objects.all()

    def get_permissions(self):
        super().set_request_data(self.request)
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

    @action(detail=False, methods=['GET'], name='Return Proper Audit')
    def proper_audits(self, request):
        params = list(request.GET.keys())
        for bad_key in ['page', 'page_size']:
            if bad_key in params:
                params.remove(bad_key)
        for key in params:
            self.queryset = self.queryset.filter(**{key: request.GET.get(key)})
        serializer = get_proper_serializer(self.queryset, many=True)
        data = serializer.data
        for dictionary in data:
            dictionary = fix_audit(dictionary)
        return Response(data)

    @action(detail=False, methods=['GET'], name='Audit Progression Metrics')
    def progression_metrics(self, request):  # pylint: disable=no-self-use
        audit_id = request.query_params.get('audit_id', -1)
        try:
            audit = Audit.objects.get(audit_id=audit_id)
            total_items = audit.inventory_items.count()
            records = Record.objects.filter(audit=audit_id)
            new_items = records.filter(status='New').count()
            completed_items = records.count() - new_items
        except ObjectDoesNotExist as ex:
            raise Http404 from ex

        return Response(
            compile_progression_metrics(completed_items, total_items, audit.accuracy),
            status=status.HTTP_200_OK)


def fix_audit(dictionary):
    person = dictionary.pop('initiated_by')
    dictionary['initiated_by'] = person['first_name'] + ' ' + person['last_name']
    dictionary['location'] = person['location']
    time = datetime.strftime(datetime.strptime(dictionary['initiated_on'],
                                               '%Y-%m-%dT%H:%M:%S.%fZ'), '%d/%m/%Y')
    dictionary['initiated_on'] = time
    items = dictionary.pop('inventory_items')
    dictionary['bin'] = None
    for item in items:
        popped_bin = item.pop('Bin')
        if not dictionary['bin']:
            dictionary['bin'] = popped_bin
        else:
            if popped_bin != dictionary['bin']:
                dictionary['bin'] = 'Multiple'
                break
    return dictionary


def set_audit_accuracy(audit_id):
    audit = Audit.objects.get(audit_id=audit_id)
    records = Record.objects.filter(audit=audit_id)
    audit_accuracy = calculate_accuracy(records)
    setattr(audit, 'accuracy', audit_accuracy)
    audit.save()


def set_bin_accuracy(bin_id):
    bintosk = BinToSK.objects.get(bin_id=bin_id)
    records = Record.objects.filter(bin_to_sk=bin_id)
    bin_accuracy = calculate_accuracy(records)
    setattr(bintosk, 'accuracy', bin_accuracy)
    bintosk.save()


def calculate_accuracy(record_queryset):
    missing = record_queryset.filter(status='Missing').count()
    found = record_queryset.filter(status='Provided').count()
    total_records_no_new = found + missing
    return 0.0 if total_records_no_new == 0 else found / total_records_no_new


def compile_progression_metrics(completed_items, total_items, accuracy):
    remaining_items = total_items - completed_items
    percent_complete = 0.0 if total_items == 0 else ((completed_items / total_items) * 100)
    percent_complete = round(percent_complete, 2)
    audit_accuracy = round(accuracy * 100, 2)

    metrics_report = {
        'completed_items' : completed_items,
        'remaining_items' :  remaining_items,
        'completion_percentage' : percent_complete,
        'accuracy' : audit_accuracy
    }
    return metrics_report


def get_item_serializer(*args, **kwargs): # pylint: disable=no-self-use
    return ItemSerializer(*args, **kwargs)


def get_proper_serializer(*args, **kwargs):
    return ProperAuditSerializer(*args, **kwargs)


class BinToSKViewSet(LoggingViewset):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'get', 'patch', 'delete']
    queryset = BinToSK.objects.all()

    def get_permissions(self):
        super().set_request_data(self.request)
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

    # pylint: disable=protected-access
    @action(detail=False, methods=['GET'], name='Get Items In Bin')
    def items(self, request):
        bin_id = self.request.query_params.get('bin_id')
        audit_id = request.query_params.get('audit_id')
        bins = BinToSK.objects.get(bin_id=bin_id)
        queryset = Audit.objects.get(audit_id=audit_id)
        records = Record.objects.filter(bin_to_sk_id=bin_id).all()
        completed_items = [record.item_id for record in records]
        bin_items = []
        for item in queryset.inventory_items.all():
            if item.Item_Id in bins.item_ids\
                    and item.Item_Id not in completed_items:
                bin_items.append(item)
        serializer = get_item_serializer(bin_items, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Bin Progression Metrics')
    def progression_metrics(self, request):
        bin_id = self.request.query_params.get('bin_id', -1)
        try:
            bintosk = BinToSK.objects.get(bin_id=bin_id)
            total_items = len(bintosk.item_ids)
            records = Record.objects.filter(bin_to_sk=bin_id)
            new_items = records.filter(status='New').count()
            completed_items = records.count() - new_items
        except ObjectDoesNotExist as ex:
            raise Http404 from ex

        return Response(
            compile_progression_metrics(completed_items, total_items, bintosk.accuracy),
            status=status.HTTP_200_OK)


class RecordViewSet(LoggingViewset):
    http_method_names = ['post', 'get', 'patch', 'delete']
    queryset = Record.objects.all()

    def get_permissions(self):
        super().set_request_data(self.request)
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
            if 'bin_to_sk' in response.data:
                set_bin_accuracy(response.data['bin_to_sk'])
        return self.response

    def destroy(self, request, *args, **kwargs): # pylint: disable=unused-argument
        instance = self.get_object()
        self.perform_destroy(instance)
        set_audit_accuracy(instance.audit.audit_id)
        set_bin_accuracy(instance.bin_to_sk.bin_id)
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
        bin_id = self.request.query_params.get('bin_id', -1)
        audit_id = self.request.query_params.get('audit_id', -1)
        item_id = self.request.query_params.get('item_id', -1)
        response = Response(status=status.HTTP_400_BAD_REQUEST)

        try:  # Check that the item exists for this Audit
            bins = BinToSK.objects.get(bin_id=bin_id)
            audit = Audit.objects.get(audit_id=audit_id)
            item = audit.inventory_items.get(Item_Id=item_id)
        except (ObjectDoesNotExist, ValueError) as ex:
            raise Http404 from ex

        record = {}
        try:  # Check that the item hasn't already been recorded
            audit_records = Record.objects.filter(audit=audit_id)
            record = audit_records.get(item_id=item_id)
        except ObjectDoesNotExist:
            if item.Item_Id in bins.item_ids:  # Check that the item belongs to the current bin
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
