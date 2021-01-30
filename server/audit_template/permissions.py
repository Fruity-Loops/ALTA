from rest_framework.permissions import BasePermission

from .models import AuditTemplate


class CheckTemplateOrganizationById(BasePermission):
    message = "The requested template must be of the same organization"

    def has_permission(self, request, view):
        if request.parser_context['kwargs'] is not None \
                and 'pk' in request.parser_context['kwargs']:
            temp = AuditTemplate.objects.get(template_id=request.parser_context['kwargs']['pk'])
            return temp.organization == request.user.organization
        return True
