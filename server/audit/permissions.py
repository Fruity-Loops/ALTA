from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission
from user_account.models import CustomUser
from .models import Audit, Record


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


class IsAssignedToBin(BasePermission):
    message = "You must be assigned to this bin to access it's information"

    def has_permission(self, request, view):
        assigned_sk = False
        if 'customuser_id' in request.query_params:
            try:
                user = CustomUser.objects.get(email=request.user)
                assigned_sk = request.query_params.get('customuser_id')
                assigned_sk = str(assigned_sk) == str(user.id)
            except (ObjectDoesNotExist, KeyError):
                pass
        return assigned_sk


class IsAssignedToAudit(BasePermission):
    message = "You must be assigned to this audit to access it's information"

    def has_permission(self, request, view):
        assigned_sk = True
        if 'audit' in request.data:
            try:
                user = CustomUser.objects.get(email=request.user)
                audit = Audit.objects.get(audit_id=request.data['audit'])
                assigned_sk = audit.assigned_sk.get(id=user.id)
            except (ObjectDoesNotExist, KeyError):
                assigned_sk = False
        return assigned_sk


class IsAssignedToRecord(BasePermission):
    message = "You must be assigned to this record to access it's information"

    def has_permission(self, request, view):
        assigned_sk = True
        if 'pk' in view.kwargs:
            record_id = view.kwargs["pk"]
            try:
                user = CustomUser.objects.get(email=request.user)
                record = Record.objects.get(pk=record_id)
                assigned_sk = record.audit.assigned_sk.get(id=user.id)
            except (ObjectDoesNotExist, KeyError):
                assigned_sk = False
        return assigned_sk
