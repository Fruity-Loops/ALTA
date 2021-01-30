from rest_framework.permissions import BasePermission


class ValidateOrgMatchesUser(BasePermission):

    def has_permission(self, request, view):
        user = request.user
        if 'pk' in request.parser_context['kwargs']:
            return str(user.organization_id) == request.parser_context['kwargs']['pk']
        return True
