from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsInventoryManager, IsSystemAdmin

from .serializers import AuditSerializer #, SelectedItemsSerializer
from .models import Audit #, SelectedItems
from inventory_item.models import Item


class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be created.
    """
    http_method_names = ['post', 'patch', 'get']
    serializer_class = AuditSerializer
    queryset = Audit.objects.all()
    permission_classes = [IsAuthenticated | IsSystemAdmin]

"""
    def get_serializer_class(self):
        
        Overriding default serializer class to specify custom serializer
        for view actions
        :param: actions
        :return: serializer
        
        if self.action == 'create':
            return AuditSerializer
        if self.action == 'partial_update':
            return AssignedSKSerializer
        return AuditSerializer
"""