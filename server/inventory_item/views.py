from rest_framework import viewsets
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

import django_filters.rest_framework

from .serializers import ItemSerializer
from .models import Item


class DynamicSearchFilter(filters.SearchFilter):
    def get_search_fields(self, view, request):
        return request.GET.getlist('search_fields', [])


class ItemResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000
    print(page_size)


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    # pagination
    pagination_class = ItemResultsSetPagination
    # filter
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend]
    filterset_fields = ['_id', 'Location', 'Zone', 'Aisle', 'Part_Number', 'Serial_Number',
                        'Condition', 'Category', 'Owner', 'Average_Cost', 'Quantity',
                        'Unit_of_Measure', 'organization']

