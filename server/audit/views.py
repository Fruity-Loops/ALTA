from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsInventoryManager, IsSystemAdmin

from .serializers import AuditSerializer
from .models import Audit
from .serializers import AssignedSKSerializer
from .models import AssignedSK



class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """

    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager | IsSystemAdmin]
    http_method_names = ['post']

class AssignedSKViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows assigned stock keepers to be linked to created audits.
    """

    queryset = AssignedSK.objects.all()
    serializer_class = AssignedSKSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager | IsSystemAdmin]
    http_method_names = ['post']
