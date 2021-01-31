from rest_framework import viewsets, status
from rest_framework.response import Response
from user_account.permissions import HasSameOrgInQuery, \
    PermissionFactory
from .permissions import CheckAuditOrganizationById, CheckInitAuditData, ValidateSKOfSameOrg
from .serializers import AuditSerializer, ItemToSKSerializer, GetAuditSerializer
from .models import Audit, ItemToSK


class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get', 'delete']
    queryset = Audit.objects.all()

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([
            CheckAuditOrganizationById, HasSameOrgInQuery])
        return [permission() for permission in permission_classes]

    def get_serializer(self, *args, **kwargs):
        serializer_class = AuditSerializer
        if self.action in ['retrieve']:
            serializer_class = GetAuditSerializer
        return serializer_class(*args, **kwargs)

    def list(self, request):
        if request.GET.get("status", '') != '':
            queryset = Audit.objects.filter(status=request.GET.get("status", '')) \
                .filter(organization_id=request.GET.get("organization", ''))
        else:
            queryset = Audit.objects.filter(organization_id=request.GET.get("organization", ''))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class ItemToSKViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'get', 'delete']
    queryset = ItemToSK.objects.all()
    serializer_class = ItemToSKSerializer

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([
            CheckInitAuditData, HasSameOrgInQuery, ValidateSKOfSameOrg])
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        saved_audit = serializer.save()
        if saved_audit:
            data = {'success': 'success'}
        if not saved_audit:
            return Response({'error': 'failed'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset()).filter(
                init_audit_id=request.query_params.get('init_audit_id'))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
