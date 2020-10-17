from rest_framework.permissions import BasePermission
from .models import CustomUser


class isSystemAdmin(BasePermission):
    message = "You must be a System Admin to do this operation"

    def has_permission(self, request, view):
        """
        Overriding default has_permission method in order to add Custom permissions to our views
        :param request:
        :param view:
        :return: True/False : Whether the user is a SysAdmin or Not
        """
        user = CustomUser.objects.get(user_name=request.user)
        if user.role == 'SA':
            return True
        else:
            return False


class isInventoryManager(BasePermission):
    message = "You must be an Inventory Manager to do this operation"

    def has_permission(self, request, view):
        """
        Overriding default has_permission method in order to add Custom permissions to our views
        :param request:
        :param view:
        :return: True/False : Whether the user is a Inventory Manager or Not
        """
        user = CustomUser.objects.get(user_name=request.user)
        if user.role == 'IM':
            return True
        else:
            return False
