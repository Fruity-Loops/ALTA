from user_account.permissions import IsInventoryManager
from user_account.models import CustomUser
from .models import Audit


class IsInventoryManagerAudit(IsInventoryManager):
    message = "You must be an Inventory Manager of this organization to do this operation"

    def has_permission(self, request, view):
        user = CustomUser.objects.get(email=request.user)

        if request.parser_context['kwargs'] is not None \
                and 'pk' in request.parser_context['kwargs']:
            temp = Audit.objects.get(audit_id=request.parser_context['kwargs']['pk'])
            return temp.organization_id == user.organization.org_id and user.role == 'IM'

        if 'init_audit' in request.data:
            get_audit = Audit.objects.get(audit_id=request.data['init_audit'])
            return get_audit.organization_id == user.organization_id and user.role == 'IM'

        return super().has_permission(request, view)