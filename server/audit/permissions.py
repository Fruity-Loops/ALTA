from user_account.permissions import IsInventoryManager
from user_account.models import CustomUser
from organization.models import Organization
from .models import Audit, ItemToSK


class IsInventoryManagerAudit(IsInventoryManager):
    message = "You must be an Inventory Manager belonging to this organization to do this operation"

    def has_permission(self, request, view):
        user = CustomUser.objects.get(email=request.user)

        if request.parser_context['kwargs'] is not None \
                and 'pk' in request.parser_context['kwargs']:
            temp = Audit.objects.get(audit_id=request.parser_context['kwargs']['pk'])
            return temp.org_id == user.organization.org_id and user.role == 'IM'

        if 'init_audit' in request.data:
            get_audit = Audit.objects.get(audit_id=request.data['init_audit'])
            return get_audit.org_id == user.organization_id and user.role == 'IM'

        user_org = Organization.objects.get(org_id=request.data['org'])
        return user.role == 'IM' and user_org.org_id == user.organization_id
