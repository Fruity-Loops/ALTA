from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .serializers import ItemSerializer
from .models import Item


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """

    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
