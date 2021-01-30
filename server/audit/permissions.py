from rest_framework.permissions import BasePermission

from user_account.models import CustomUser
from .models import Audit


class CheckAuditOrganizationById(BasePermission):
    message = "You must be an Inventory Manager of this organization to do this operation"

    def has_permission(self, request, view):
        user = CustomUser.objects.get(email=request.user)

        if request.parser_context['kwargs'] is not None \
                and 'pk' in request.parser_context['kwargs']:
            temp = Audit.objects.get(audit_id=request.parser_context['kwargs']['pk'])
            return temp.organization_id == user.organization.org_id

        return True


class CheckInitAuditData(BasePermission):

    def has_permission(self, request, view):
        user = CustomUser.objects.get(email=request.user)
        if 'init_audit' in request.data:
            get_audit = Audit.objects.get(audit_id=request.data['init_audit'])
            return get_audit.organization_id == user.organization_id
        return True


class ValidateSKOfSameOrg(BasePermission):

    def has_permission(self, request, view):
        if 'customuser' in request.data:
            user = CustomUser.objects.get(id=request.data['customuser'])
            return user.organization_id == request.user.organization_id
