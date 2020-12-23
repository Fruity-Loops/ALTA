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
    if 'fields_to_save' in request.data:
        if 'organization' in request.data['fields_to_save']:
            return user.organization_id == request.data['fields_to_save']['organization']
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
        correct_organization = [None, None, None]
        if request.GET.get("organization", None) is not None:
            correct_organization[0] = get_self_org_query(user, request)
        if request.data.get('fields_to_save', None) is not None:
            correct_organization[1] = get_self_org_body(user, request)
        if request.parser_context['kwargs'] is not None and 'pk'\
                in request.parser_context['kwargs']:
            correct_organization[2] = get_self_org(user, request)

        for found_false in correct_organization:
            if found_false is not None and not found_false:
                return False

        # Used to ensure only the requests accounted for are being made
        sent_proper_organization = False
        for found_true in correct_organization:
            if found_true:
                sent_proper_organization = True

        if not sent_proper_organization:
            return False

        if user.role in ['IM']:
            return True
        return False


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
