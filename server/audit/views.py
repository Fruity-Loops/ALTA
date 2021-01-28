from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsSystemAdmin
from .permissions import IsInventoryManagerAudit
from .permissions import IsAssignedSKNoCreate
from .serializers import AuditSerializer, BinToSKSerializer, GetAuditSerializer
from .models import Audit, BinToSK

class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get']
    queryset = Audit.objects.all()
    permission_classes = [
        IsAuthenticated,
        (IsSystemAdmin | IsInventoryManagerAudit | IsAssignedSKNoCreate)
    ]

    def get_serializer(self, *args, **kwargs):
        serializer_class = AuditSerializer
        if self.action in ['retrieve']:
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

class BinToSKViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'get']
    queryset = BinToSK.objects.all()
    serializer_class = BinToSKSerializer
    permission_classes = [
        IsAuthenticated,
        (IsSystemAdmin | IsInventoryManagerAudit | IsAssignedSKNoCreate)
    ]


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
        customuser_id = request.query_params.get('customuser_id')
        init_audit_id = request.query_params.get('init_audit_id')

        if customuser_id:
            self.queryset = self.queryset.filter(customuser_id=customuser_id)
        if init_audit_id:
            self.queryset = self.queryset.filter(init_audit_id=init_audit_id)

        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)
