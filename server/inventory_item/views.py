from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from django_server.permissions import IsInventoryManager

from .serializers import ItemSerializer
from .models import Item


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated, IsInventoryManager]
    http_method_names = ['get']