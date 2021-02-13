from rest_framework import viewsets
from rest_framework import filters
from user_account.permissions import PermissionFactory
from rest_framework.pagination import PageNumberPagination

from .serializers import ItemSerializer
from .models import Item


class DynamicSearchFilter(filters.SearchFilter):
    def get_search_fields(self, view, request):
        return request.GET.getlist('search_fields', [])


class ItemResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000


class CustomSearchFilter(filters.SearchFilter):
    """
    Filter that only allows users to see their own objects.
    """
    def filter_queryset(self, request, queryset, view):
        filterset_qty_fields = ['_id', 'Average_Cost', 'Quantity']
        filterset_iexact_fields = ['Location', 'Plant', 'Zone', 'Aisle', 'Part_Number',
                                   'Serial_Number', 'Condition', 'Category', 'Owner',
                                   'Unit_of_Measure']

        for field in filterset_qty_fields:
            field_from = '{0}_from'.format(field)
            field_to = '{0}_from'.format(field)
            if field_from in request.query_params:
                param = {'{0}__{1}'.format(field, 'gte'): request.query_params[field_from]}
                queryset = queryset.filter(**param)
            if field_to in request.query_params:
                param = {'{0}__{1}'.format(field, 'lte'): request.query_params[field_to]}
                queryset = queryset.filter(**param)

        for field in filterset_iexact_fields:
            if field in request.query_params:
                param = {'{0}__{1}'.format(field, 'iexact'): request.query_params[field]}
                queryset = queryset.filter(**param)

        return queryset


class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """
    queryset = Item.objects.all().order_by('_id')
    serializer_class = ItemSerializer
    http_method_names = ['get']
    # pagination
    pagination_class = ItemResultsSetPagination
    # search and filter
    filter_backends = [filters.SearchFilter, CustomSearchFilter]
    search_fields = ['Location', 'Zone', 'Plant', 'Part_Number', 'Part_Description',
                     'Serial_Number', 'Condition', 'Category', 'Owner', 'Unit_of_Measure']

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([])
        return [permission() for permission in permission_classes]
