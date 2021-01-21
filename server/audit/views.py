from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsInventoryManager, IsSystemAdmin
from .permissions import IsInventoryManagerAudit

from .serializers import AuditSerializer, GetAuditSerializer, ItemToSKSerializer
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
        if self.action in ['list', 'retrieve']:
            serializer_class = GetAuditSerializer
        return serializer_class(*args, **kwargs)

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



