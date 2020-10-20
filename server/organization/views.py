from rest_framework import viewsets
from rest_framework import status
from rest_framework.response import Response
from rest_framework.request import Request

from .serializers import OrganizationSerializer
from .models import Organization


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """

    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
