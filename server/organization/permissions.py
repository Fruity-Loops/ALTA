from rest_framework.permissions import BasePermission
from user_account.permissions import IsSystemAdmin, IsInventoryManager


class UserOrganizationPermission(BasePermission):

    def has_permission(self, request, view):
        """
             Overriding default has_permission method in order to add Custom
             permissions to our views
             This can be used either inside the permission_class directly or
             you can call it from other permission files
             :param request:
             :param view:
             :return: True/False : Whether the user is allowed to perform CRUD
        """
        if view.action in ['list', 'retrieve', 'update', 'partial_update']:
            return IsSystemAdmin.has_permission(None, request, None)\
                   or IsInventoryManager.has_permission(None, request, view)
        if view.action in ['create', 'destroy']:
            return IsSystemAdmin.has_permission(None, request, None)

        return False
