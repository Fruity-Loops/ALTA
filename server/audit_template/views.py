from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated

from .serializers import AuditTemplateSerializer
from .models import AuditTemplate
from rest_framework.response import Response

from rest_framework import status
from rest_framework.response import Response
from rest_framework.settings import api_settings

class AuditTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audit templates to be viewed or created.
    """

    queryset = AuditTemplate.objects.all()
    serializer_class = AuditTemplateSerializer
    permission_classes = [IsAuthenticated]
