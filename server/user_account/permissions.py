from rest_framework.permissions import BasePermission
from django_server.permissions import IsSystemAdmin, IsCurrentUserTargetUser


class UserAccountPermission(BasePermission):

    def has_permission(self, request, view):
        """
             Overriding default has_permission method in order to add Custom
             permissions to our views
             This can be used either inside the permission_class directly or
             you can call it from other permission files
             :param request: Where i retrieve the authenticated user
             :param view: Where i can retrieve the arguments passed in url, actions ..
             :return: True/False : Whether the user is allowed to perform CRUD
        """
        if view.action in ['retrieve']:
            return IsCurrentUserTargetUser.has_permission(None, request, view)

        if view.action in ['create']:
            return IsSystemAdmin.has_permission(None, request, None)

        return False
