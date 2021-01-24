from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsSystemAdmin
from .permissions import IsInventoryManagerAudit
from inventory_item.serializers import ItemSerializer
from .serializers import AuditSerializer, ItemToSKSerializer
from user_account.serializers import UserAuditSerializer
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
        if self.action in ['list']:
            serializer_class.Meta.fields = ['audit_id', 'organization', 'status', 'assigned_sk']
            setattr(serializer_class, 'assigned_sk', UserAuditSerializer(read_only=True, many=True))
        elif self.action in ['create', 'retrieve']:
            serializer_class.Meta.fields = '__all__'
        else:
            serializer_class.Meta.fields = list(self.request.data.keys())
            if 'assigned_sk' in serializer_class.Meta.fields:
                setattr(serializer_class, 'assigned_sk', UserAuditSerializer(read_only=True, many=True))
            if 'inventory_items' in serializer_class.Meta.fields:
                setattr(serializer_class, 'inventory_items', ItemSerializer(read_only=True, many=True))
        return serializer_class(*args, **kwargs)

    def list(self, request):
        if request.GET.get("status", '') is not '':
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