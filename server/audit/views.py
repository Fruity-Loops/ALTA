from datetime import datetime
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Count
from django.http import Http404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
import csv
from django.http import HttpResponse

from rest_framework import viewsets
from django_server.custom_logging import LoggingViewset
from inventory_item.serializers import ItemSerializer
from user_account.permissions import PermissionFactory
from .serializers import GetAuditSerializer, GetBinToSKSerializer, \
    PostBinToSKSerializer, RecordSerializer, AuditSerializer, ProperAuditSerializer, \
    AssignmentSerializer, GetAssignmentSerializer, CommentSerializer
from .permissions import SKPermissionFactory, CheckAuditOrganizationById, \
    ValidateSKOfSameOrg, IsAssignedToBin, IsAssignedToAudit, \
    IsAssignedToRecord, CanCreateRecord, CanAccessAuditQParam, \
    CheckAssignmentOrganizationById
from .models import Audit, Assignment, BinToSK, Record, Comment


class AuditSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000


class AuditViewSet(LoggingViewset):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get', 'delete']
    queryset = Audit.objects.all().order_by('audit_id')
    pagination_class = AuditSetPagination

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = SKPermissionFactory(self.request)
        audit_permissions = [CheckAuditOrganizationById, ValidateSKOfSameOrg]
        permission_classes = factory.get_general_permissions(
            im_additional_perms=audit_permissions,
            sk_additional_perms=audit_permissions
        )
        return [permission() for permission in permission_classes]

    def get_serializer(self, *args, **kwargs):
        serializer_class = AuditSerializer
        if self.action in ['list', 'retrieve']:
            serializer_class = GetAuditSerializer
        return serializer_class(*args, **kwargs)

    def list(self, request):
        org_id = request.query_params.get('organization', -1)
        status = request.query_params.get('status')
        assigned_sk = request.query_params.get('assigned_sk')
        exclude_status = request.query_params.get('exclude_status')

        if status:
            self.queryset = self.queryset.filter(status=status)
        if assigned_sk:
            self.queryset = self.queryset.filter(assigned_sk__id=assigned_sk)
        if exclude_status:
            self.queryset = self.queryset.exclude(status=exclude_status)
        self.queryset = self.queryset.filter(organization_id=org_id)

        no_pagination = request.query_params.get('no_pagination')
        page = self.paginate_queryset(self.queryset)

        if page is not None and not no_pagination:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

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

    @action(detail=False, methods=['GET'], name='Return Audit File')
    def audit_file(self, request):
        """
        Action on route audit/audit_file/ that takes the parameter audit_id. This will return an HTTP response
        containing the data about the audit as a csv file.
        """

        audit_id = int(request.GET.get('audit_id'))

        # The values_list argument takes fields and not a list
        audit_items = Audit.objects.get(audit_id=audit_id).inventory_items.all() \
            .values_list('Batch_Number', 'Location', 'Plant', 'Zone', 'Aisle', 'Bin', 'Part_Number', 'Part_Description',
                         'Serial_Number', 'Condition', 'Category', 'Owner', 'Criticality', 'Average_Cost', 'Quantity',
                         'Unit_of_Measure')

        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="audit.csv"'

        # Write the csv file in the response
        writer = csv.writer(response)
        headers = ['Batch_Number', 'Location', 'Plant', 'Zone', 'Aisle', 'Bin', 'Part_Number', 'Part_Description',
                   'Serial_Number', 'Condition', 'Category', 'Owner', 'Criticality', 'Average_Cost', 'Quantity',
                   'Unit_of_Measure', 'status']
        writer.writerow(headers)

        for item in audit_items:
            item_batch_number = item[0]
            # if a record exists for the item, then the status is either 'Provided' or 'Missing', else it is 'pending
            try:
                item_record = Record.objects.get(Batch_Number=item_batch_number)
                item_status = item_record.status
            except:
                item_status = 'Pending'

            item_as_list = list(item) + [item_status]   # item is a tuple so change it into a list and ass status to it

            # write the item as a row into the csv
            writer.writerow(item_as_list)

        return response

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
    return 0.0 if total_records_no_new == 0 else round((found / total_records_no_new) * 100, 2)


def compile_progression_metrics(completed_items, total_items, accuracy):
    remaining_items = total_items - completed_items
    percent_complete = 0.0 if total_items == 0 else ((completed_items / total_items) * 100)
    percent_complete = round(percent_complete, 2)
    audit_accuracy = round(accuracy * 100, 2)

    metrics_report = {
        'completed_items': completed_items,
        'remaining_items': remaining_items,
        'completion_percentage': percent_complete,
        'accuracy': audit_accuracy
    }
    return metrics_report


def get_item_serializer(*args, **kwargs):  # pylint: disable=no-self-use
    return ItemSerializer(*args, **kwargs)


def get_proper_serializer(*args, **kwargs):
    return ProperAuditSerializer(*args, **kwargs)


class AssignmentViewSet(LoggingViewset):
    http_method_names = ['post', 'get', 'patch', 'delete']
    queryset = Assignment.objects.all()

    def get_serializer(self, *args, **kwargs):
        serializer_class = AssignmentSerializer
        if self.action in ['list', 'retrieve']:
            serializer_class = GetAssignmentSerializer
        return serializer_class(*args, **kwargs)

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = SKPermissionFactory(self.request)
        audit_permissions = [CheckAssignmentOrganizationById, ValidateSKOfSameOrg]
        permission_classes = factory.get_general_permissions(
            im_additional_perms=audit_permissions,
            sk_additional_perms=audit_permissions
        )
        return [permission() for permission in permission_classes]

    def list(self, request):
        org_id = request.query_params.get('organization', -1)
        status = request.query_params.get('status')
        assigned_sk = request.query_params.get('assigned_sk')
        exclude_status = request.query_params.get('exclude_status')

        if status:
            self.queryset = self.queryset.filter(audit__status=status)
        if assigned_sk:
            self.queryset = self.queryset.filter(assigned_sk=assigned_sk)
        if exclude_status:
            self.queryset = self.queryset.exclude(audit__status=exclude_status)
        self.queryset = self.queryset.filter(audit__organization_id=org_id)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        is_many = isinstance(request.data, list)
        serializer = self.get_serializer(data=request.data, many=is_many)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


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

    def update(self, request, *args, **kwargs):
        if 'status' in request.data and 'init_audit_id' in request.data:
            audit_id = request.data['init_audit_id']
            bins_left = BinToSK.objects.filter(init_audit_id=audit_id).exclude(status='Complete')
            if len(bins_left) == 1:
                self.complete_audit(audit_id)

        if 'customuser' in request.data and 'bin_id' in request.data:
            assigned_bin = BinToSK.objects.get(bin_id=request.data['bin_id'])
            setattr(assigned_bin, 'customuser_id', request.data['customuser'])
            assigned_bin.save()
            serializer = self.get_serializer(assigned_bin)
            return Response(serializer.data)

        return super().update(request, *args, **kwargs)

    def complete_audit(self, audit_id):
        audit = Audit.objects.get(audit_id=audit_id)
        if not audit:
            return
        data = {'status': 'Complete'}
        serializer = self.get_serializer(instance=audit, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

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
            if item.Item_Id in bins.item_ids \
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
            sk_perms = [CanAccessAuditQParam, IsAssignedToRecord | ValidateSKOfSameOrg]
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

    def destroy(self, request, *args, **kwargs):  # pylint: disable=unused-argument
        instance = self.get_object()
        self.perform_destroy(instance)
        set_audit_accuracy(instance.audit.audit_id)
        set_bin_accuracy(instance.bin_to_sk.bin_id)
        return Response(status=status.HTTP_204_NO_CONTENT)

    def list(self, request):
        org_id = request.query_params.get('organization')
        audit_id = request.query_params.get('audit_id')

        if audit_id:
            self.queryset = self.queryset.filter(audit_id=audit_id)

        self.queryset = self.queryset.filter(audit__organization_id=org_id)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)

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


class RecommendationViewSet(LoggingViewset):
    """
    Allows getting recommendations on what to audit next
    """
    http_method_names = ['get']
    serializer_class = GetBinToSKSerializer

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([])
        return [permission() for permission in permission_classes]

    def list(self, request):
        org_id = request.GET.get("organization", None)
        bins_to_recommend = list(BinToSK.objects.filter(init_audit__organization=org_id).values('Bin').
                                 annotate(total=Count('Bin')).values('Bin', 'total').order_by('-total')[:5])

        parts_to_recommend = list(
            Record.objects.filter(bin_to_sk__init_audit__organization=org_id).values('Part_Number').annotate(
                total=Count('Part_Number'))
                .values('Part_Number', 'total').order_by('total').order_by('-total')[:5])

        items_to_recommend = list(
            Record.objects.filter(bin_to_sk__init_audit__organization=org_id, flagged=True).values('item_id').annotate(
                total=Count('item_id'))
                .values('item_id', 'total').order_by('-total')[:5])

        data = {'bins_recommendation': bins_to_recommend, 'parts_recommendation': parts_to_recommend,
                'items_recommendation': items_to_recommend}
        return Response(data)


class CommentViewSet(viewsets.ModelViewSet):
    http_method_names = ['get', 'post']
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get_permissions(self):
        factory = SKPermissionFactory(self.request)
        permission_classes = factory.get_general_permissions(
            im_additional_perms=[],
            sk_additional_perms=[]
        )
        return [permission() for permission in permission_classes]

    def list(self, request, *args, **kwargs):
        org_id = request.GET.get("organization", None)
        audit_id = request.GET.get("ref_audit", None)
        if org_id is None or audit_id is None:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        queryset = self.filter_queryset(self.get_queryset()).filter(org_id=org_id).filter(ref_audit=audit_id)
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)
