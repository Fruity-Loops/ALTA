from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from .serializers import AuditTemplateSerializer
from .models import AuditTemplate
from rest_framework.response import Response

from rest_framework import status
from rest_framework.response import Response
from datetime import date
from rest_framework.settings import api_settings

from user_account.permissions import IsSystemAdmin, IsCurrentUserTargetUser, IsInventoryManager


class AuditTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audit templates to be viewed or created.
    """

    queryset = AuditTemplate.objects.all()
    serializer_class = AuditTemplateSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager | IsSystemAdmin]
    http_method_names = ['post', 'get']

    def get_queryset(self):
        return AuditTemplate.objects.filter(organization_id=self.request.GET.get("organization", ''))

    def create(self, request, **kwargs):
        data = request.data
        user = request.user
        name = user.first_name + " " + user.last_name
        today = date.today()
        date_today = today.strftime("%B %d, %Y")
        data['author'] = name
        data['calendar_date'] = date_today
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(status=status.HTTP_201_CREATED)
