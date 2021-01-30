from rest_framework.permissions import BasePermission
from user_account.models import CustomUser


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
        user = CustomUser.objects.get(email=request.user)
        return user.role == 'SA'


def get_self_org(user, request):
    if request.path[0:5] == "/user":
        other_user = CustomUser.objects.get(id=request.parser_context['kwargs']['pk'])
        return user.organization_id == other_user.organization_id and other_user.role != 'SA'

    return str(user.organization_id) == request.parser_context['kwargs']['pk'] and request.path.\
        startswith('/organization')


def get_self_org_query(user, request):
    return str(user.organization_id) == request.GET.get("organization", '')


def get_self_org_body(user, request):
    if 'organization' in request.data:
        return user.organization_id == request.data['organization']
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
        user = CustomUser.objects.get(email=request.user)
        return user.role in ['IM']


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
            return request.user.organization_id == request.data['organization']
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
        elif 'pk' in view.kwargs:
            target_user_role = IsHigherInOrganization.user_roles.index(
                CustomUser.objects.get(id=view.kwargs['pk']).role)
        elif 'role' in request.data:
            target_user_role = IsHigherInOrganization.user_roles.index(request.data['role'])
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
        else:
            return check_keys(['id', 'email', 'password'], keys)


def check_keys(bad_keys, keys):
    for bad_key in bad_keys:
        if bad_key in keys:
            return False
    return True
