from django.core.exceptions import ObjectDoesNotExist
from rest_framework.permissions import BasePermission
from user_account.models import CustomUser
from .models import Audit, Record, BinToSK
from .serializers import AuditSerializer
from user_account.permissions import PermissionFactory, IsAuthenticated,\
    HasSameOrgInBody, HasSameOrgInQuery, IsSystemAdmin


class SKPermissionFactory(PermissionFactory):
    def __init__(self, request):
        self.base_sk_permissions = [IsAuthenticated, IsStockKeeper, HasSameOrgInBody, HasSameOrgInQuery]
        super(SKPermissionFactory, self).__init__(request)

    def validate_is_sa(self):
        return IsSystemAdmin.has_permission(IsSystemAdmin(), self.request, None)

    def get_general_permissions(self, im_additional_perms, sk_additional_perms=None):
        permission_classes = self.base_sa_permissions
        if self.validate_is_im():
            permission_classes = self.base_im_permissions + im_additional_perms
        elif sk_additional_perms and not self.validate_is_sa():
            permission_classes = self.base_sk_permissions + sk_additional_perms
        return permission_classes


class IsStockKeeper(BasePermission):
    message = "You must be a Stock Keeper to do this operation"

    def has_permission(self, request, view):
        try:
            user = CustomUser.objects.get(email=request.user)
            return user.role == 'SK'
        except ObjectDoesNotExist:
            return False


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
        if 'customuser_id' in request.data:
            assigned_sk_var = request.data['customuser_id']
            audit_var = request.data['init_audit_id']
        else:
            assigned_sk_var = request.GET.get('customuser_id')
            audit_var = request.GET.get('init_audit_id')
            if not audit_var:
                audit_var = request.GET.get('audit_id')
        if assigned_sk_var and audit_var:
            try:
                user = CustomUser.objects.get(email=request.user)
                serializer = AuditSerializer(Audit.objects.get(audit_id=audit_var), many=False)
                audit = serializer.data
                assigned_sk = str(assigned_sk_var) == str(user.id) and user.id in audit['assigned_sk']
            except (ObjectDoesNotExist, KeyError):
                assigned_sk = False
        return assigned_sk


class IsAssignedToAudit(BasePermission):
    message = "You must be an assigned stock keeper in this audit to access it's information"

    def has_permission(self, request, view):
        assigned_sk = False
        if 'assigned_sk' in request.data:
            assigned_sk_var = request.data['assigned_sk']
        else:
            assigned_sk_var = request.GET.get('assigned_sk')
        if assigned_sk_var:
            try:
                user = CustomUser.objects.get(email=request.user)
                assigned_sk = assigned_sk_var == str(user.id)
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


class CanCreateRecord(BasePermission):
    message = "You must have initiated this audit to access it's information"

    def has_permission(self, request, view):
        can_create = True
        for key in ['audit', 'bin_to_sk', 'Bin']:
            if key not in list(request.data.keys()):
                can_create = False

        if can_create:
            try:
                user = CustomUser.objects.get(email=request.user)
                serializer = AuditSerializer(Audit.objects.get(audit_id=request.data['audit']), many=False)
                audit = serializer.data
                bin_to_sk = BinToSK.objects.get(bin_id=request.data['bin_to_sk'])
                if user.id not in audit['assigned_sk'] or\
                        user.id != bin_to_sk.customuser.id:
                    can_create = False
            except (ObjectDoesNotExist, KeyError):
                can_create = False
        return can_create
