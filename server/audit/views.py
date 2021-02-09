from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from user_account.permissions import HasSameOrgInQuery, \
    PermissionFactory
from .permissions import *
from .serializers import *
from inventory_item.serializers import ItemSerializer
from .models import Audit, BinToSK, Record

class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get', 'delete']
    queryset = Audit.objects.all()
    permission_classes = []

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([
            CheckAuditOrganizationById, HasSameOrgInQuery, ValidateSKOfSameOrg])
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

    def get_item_serializer(self, *args, **kwargs): # pylint: disable=no-self-use 
        serializer_class = ItemSerializer
        return serializer_class(*args, **kwargs)

    def get_record_serializer(self, *args, **kwargs): # pylint: disable=no-self-use 
        serializer_class = RecordSerializer
        return serializer_class(*args, **kwargs)

    @action(detail=False, methods=['GET'], name='Check Item for Validation')
    def check_item(self, request):
        bin_id = request.query_params.get('bin_id')
        audit_id = request.query_params.get('audit_id')
        item_id = request.query_params.get('item_id')

        bins = BinToSK.objects.get(bin_id=bin_id)
        audit = Audit.objects.get(audit_id=audit_id)
        item = audit.inventory_items.get(_id=item_id)

        serializer = self.get_item_serializer(item, many=False)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Get Completed Items for Audit')
    def completed_items_audit(self, request):
        audit_id = request.query_params.get('audit_id')
        records = Record.objects.filter(audit_id=audit_id)
        
        serializer = self.get_record_serializer(records, many=True)
        return Response(serializer.data)
        
    @action(detail=False, methods=['GET'], name='Get Completed Items for Bin')
    def completed_items_bin(self, request):
        bin_id = request.query_params.get('bin_id')
        records = Record.objects.filter(bin_to_sk_id=bin_id)
        
        serializer = self.get_record_serializer(records, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['GET'], name='Get Items In Bin')
    def items(self, request):
        bin_id = request.query_params.get('bin_id')
        audit_id = request.query_params.get('audit_id')
        bins = BinToSK.objects.get(bin_id=bin_id)
        queryset = Audit.objects.get(audit_id=audit_id)
        records = Record.objects.filter(bin_to_sk_id=bin_id).all()
        completed_items =[record.item_id for record in records]
        bin_items = []
        for item in queryset.inventory_items.all():
            if int(item._id) in bins.item_ids and int(item._id) not in completed_items:
                bin_items.append(item)

        serializer = self.get_item_serializer(bin_items, many=True)
        return Response(serializer.data)


class BinToSKViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'get', 'delete']
    queryset = BinToSK.objects.all()
    permission_classes = []

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([
            CheckAuditOrganizationById, HasSameOrgInQuery, ValidateSKOfSameOrg])
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

class RecordViewSet(viewsets.ModelViewSet):
    http_method_names = ['post', 'get', 'patch', 'delete']
    queryset = Record.objects.all()
    permission_classes = []

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([
            CheckAuditOrganizationById, HasSameOrgInQuery, ValidateSKOfSameOrg])
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
        return Response(serializer.data, status=status.HTTP_201_CREATED)