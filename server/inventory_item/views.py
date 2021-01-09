from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

from .serializers import ItemSerializer
from .models import Item


class ItemResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """

    queryset = Item.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    # pagination
    pagination_class = ItemResultsSetPagination

    def list(self, request, *args, **kwargs):

        if list(self.request.data.keys()):
            if '_id' in list(self.request.data.keys()):
                item_objects = Item.objects.filter(_id__in=self.request.data.get('_id'))
                serializer = self.get_serializer(item_objects, many=True)
                return Response(serializer.data)

        return super().list(request, *args, **kwargs)

    def get_serializer(self, *args, **kwargs):
        serializer_class = ItemSerializer

        if self.action == 'list' and list(self.request.data.keys()):
            serializer_class.Meta.fields = list(self.request.data.keys())
        else:
            serializer_class.Meta.fields = '__all__'
        return serializer_class(*args, **kwargs)

