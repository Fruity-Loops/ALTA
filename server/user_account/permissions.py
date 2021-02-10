from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission, IsAuthenticated
from user_account.models import CustomUser
from audit.permissions import IsAssignedSK


class PermissionFactory:
    def __init__(self, request):
        self.base_sa_permissions = [IsAuthenticated, IsSystemAdmin]
        self.base_im_permissions = [IsAuthenticated, IsInventoryManager, HasSameOrgInBody]
        self.base_sk_permissions = [IsAssignedSK]
        self.request = request

    def validate_is_sa(self):
        return IsSystemAdmin.has_permission(IsSystemAdmin(), self.request, None)

    def validate_is_im(self):
        return IsInventoryManager.has_permission(IsInventoryManager(), self.request, None)

    def get_general_permissions(self, additional_perms):
        if self.validate_is_sa():
            permission_classes = self.base_sa_permissions
        elif self.validate_is_im():
            permission_classes = self.base_im_permissions + additional_perms
        else:
            permission_classes = self.base_sk_permissions + additional_perms
        return permission_classes


class IsSystemAdmin(BasePermission):
    message = "You must be a System Admin to do this operation"

    def has_permission(self, request, view):
        """
        Overriding default has_permission method in order to add Custom permissions to our views
        This can be used either inside the permission_class directly or you can call it
        from other permission files
        :param request:
        :param view:
        :return: True/False : Whether the user is a SysAdmin or Not
        """
        try:
            user = CustomUser.objects.get(email=request.user)
            return user.role == 'SA'
        except ObjectDoesNotExist:
            return False


class IsInventoryManager(BasePermission):
    message = "You must be an Inventory Manager to do this operation"

    def has_permission(self, request, view):
        """
        Overriding default has_permission method in order to add Custom permissions to our views
        This can be used either inside the permission_class directly or you can call it
        from other permission files
        :param request:
        :param view:
        :return: True/False : Whether the user is a Inventory Manager or Not
        """
        try:
            user = CustomUser.objects.get(email=request.user)
            return user.role in ['IM']
        except ObjectDoesNotExist:
            return False


class HasSameOrgInQuery(BasePermission):
    message = "You must query the same organization as yours"

    def has_permission(self, request, view):
        org_id = request.GET.get("organization", None)
        user = request.user
        if org_id is not None:
            return str(user.organization_id) == request.GET.get("organization", '')
        return True


class HasSameOrgInBody(BasePermission):
    message = "You organization that you are referring in the body of your request must match yours"

    def has_permission(self, request, view):
        if 'organization' in request.data:
            return str(request.user.organization_id) == str(request.data['organization'])
        return True


class UserHasSameOrg(BasePermission):
    message = "The user you are trying to access must be of the same organization as you"

    def has_permission(self, request, view):
        if 'pk' in request.parser_context['kwargs']:
            other_user = CustomUser.objects.get(id=request.parser_context['kwargs']['pk'])
            return request.user.organization_id == other_user.organization_id
        return True


class IsCurrentUserTargetUser(BasePermission):
    message = "You must be the login user to modify your own account"

    def has_permission(self, request, view):
        """
        Overriding default has_permission method in order to add Custom permissions to our views
        This can be used either inside the permission_class directly or you can call it
        from other permission files
        :param request: Getting the user that is doing the request
        :param view: Getting the targeted pk passed in the URL
        :return: True/False : Whether the user is a Inventory Manager or Not
        """
        current_user = request.user
        target_user = CustomUser.objects.get(id=view.kwargs['pk'])
        return current_user == target_user


class IsHigherInOrganization(BasePermission):
    message = "You must be of a higher rank than the employee you are trying to modify"
    user_roles = ["SA", "IM", "SK"]

    def has_permission(self, request, view):
        """
        :param request: Getting the user that is doing the request
        :param view: Getting the targeted pk passed in the URL
        :return: True/False : Whether the user is allowed to modify the user
        """
        current_user_role = IsHigherInOrganization.user_roles.index(request.user.role)
        if request.method == 'POST':  # On create of a user
            target_user_role = IsHigherInOrganization.user_roles.index(request.data['role'])
        elif 'role' in request.data:
            target_user_role = IsHigherInOrganization.user_roles.index(request.data['role'])
        elif 'pk' in view.kwargs:
            target_user_role = IsHigherInOrganization.user_roles.index(
                CustomUser.objects.get(id=view.kwargs['pk']).role)
        else:
            return True
        return current_user_role <= target_user_role


class CanUpdateKeys(BasePermission):
    message = "Roles and Emails shouldn't be allowed to be updated"

    def has_permission(self, request, view):
        """
        :param request: Getting the user that is doing the request
        :param view: Getting the targeted pk passed in the URL
        :return: True/False : Whether the user is allowed to modify the user
        """
        keys = list(request.data.keys())
        if IsCurrentUserTargetUser.has_permission(self, request, view):
            return check_keys(['id', 'email'], keys)
        return check_keys(['id', 'email', 'password'], keys)


def check_keys(bad_keys, keys):
    for bad_key in bad_keys:
        if bad_key in keys:
            return False
    return True
