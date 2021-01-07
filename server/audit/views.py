from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsInventoryManager, IsSystemAdmin

from .serializers import AuditSerializer, AssignedSKSerializer
from .models import Audit


class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch']
    queryset = Audit.objects.all()
    permission_classes = [IsAuthenticated | IsSystemAdmin]

    def get_serializer_class(self):
        """
        Overriding default serializer class to specify custom serializer
        for view actions
        :param: actions
        :return: serializer
        """
        if self.action == 'create':
            return AuditSerializer
        if self.action == 'partial_update':
            return AssignedSKSerializer
        return AuditSerializer

"""
class AssignedSKViewSet(viewsets.ModelViewSet):
    """
   # API endpoint that allows assigned stock keepers to be linked to created audits.
"""

    queryset = AssignedSK.objects.all()
    serializer_class = AssignedSKSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager | IsSystemAdmin]
    http_method_names = ['post']
"""