from rest_framework.permissions import BasePermission
from django.core.exceptions import ObjectDoesNotExist
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
    message = "The requested audit must be for the same organization as the requesting user"

    def has_permission(self, request, view):
        user = CustomUser.objects.get(email=request.user)

        if 'init_audit' in request.data:
            get_audit = Audit.objects.get(audit_id=request.data['init_audit'])
            return get_audit.organization_id == user.organization_id

        if request.method == 'GET':
            audit_id = request.query_params.get('init_audit_id')
            if audit_id:
                audit = Audit.objects.get(audit_id=audit_id) or None
            if audit:
                return audit.organization_id == user.organization.org_id
        return True


class ValidateSKOfSameOrg(BasePermission):
    message = "The requested user must be part of the same organization"

    def has_permission(self, request, view):
        if 'customuser' in request.data:
            user = CustomUser.objects.get(id=request.data['customuser'])
            return user.organization_id == request.user.organization_id
        return True


class IsAssignedSK(BasePermission):
    message = "Must be a Stock Keeper that is retrieving their own audits"

    def has_permission(self, request, view):
        try:
            user = CustomUser.objects.get(email=request.user)
            if request.method == 'GET':
                assigned_sk = (request.query_params.get('assigned_sk')
                or request.query_params.get('customuser_id'))
                return user.role == 'SK' and str(assigned_sk) == str(user.id)
            audit_id = request.data['audit']
            if audit_id:
                audit = Audit.objects.get(audit_id=audit_id)
                assigned_sk = audit.assigned_sk.get(id=user.id)
            return user.role == 'SK' and assigned_sk
        except ObjectDoesNotExist:
            return False