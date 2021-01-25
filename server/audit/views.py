from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsSystemAdmin
from .permissions import IsInventoryManagerAudit
from .serializers import AuditSerializer, ItemToSKSerializer, GetAuditSerializer
from .models import Audit, ItemToSK


class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get']
    queryset = Audit.objects.all()
    permission_classes = [IsAuthenticated, IsSystemAdmin | IsInventoryManagerAudit]

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
    http_method_names = ['post', 'get']
    queryset = ItemToSK.objects.all()
    serializer_class = ItemToSKSerializer
    permission_classes = [IsAuthenticated, IsInventoryManagerAudit | IsSystemAdmin]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        saved_audit = serializer.save()
        if saved_audit:
            data = {'success': 'success'}
        if not saved_audit:
            return Response({'error': 'failed'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_201_CREATED)

    def list(self, request): # FIX 
        queryset = self.filter_queryset(self.get_queryset()).filter(
                init_audit_id=request.query_params.get('init_audit_id')) 

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
