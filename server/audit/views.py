from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from user_account.permissions import IsInventoryManager

from .serializers import AuditSerializer
from .models import Audit


class AuditViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audits to be viewed or edited.
    """

    queryset = Audit.objects.all()
    serializer_class = AuditSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager]
    http_method_names = ['get', 'post']
