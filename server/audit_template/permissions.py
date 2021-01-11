from user_account.permissions import IsInventoryManager
from .models import AuditTemplate


class IsInventoryManagerTemplate(IsInventoryManager):

    def has_permission(self, request, view):
        if request.parser_context['kwargs'] is not None \
                and 'pk' in request.parser_context['kwargs']:
            temp = AuditTemplate.objects.get(template_id=request.parser_context['kwargs']['pk'])
            return temp.organization == request.user.organization and request.user.role == 'IM'
        return super().has_permission(request, view)
