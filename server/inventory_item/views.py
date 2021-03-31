from rest_framework import filters
from rest_framework.decorators import action
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django_server.custom_logging import LoggingViewset
from user_account.permissions import PermissionFactory
from .serializers import ItemSerializer
from .models import Item
import json


class DynamicSearchFilter(filters.SearchFilter):
    def get_search_fields(self, view, request):
        return request.GET.getlist('search_fields', [])


class ItemResultsSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000


def get_fields():
    return ['Location', 'Plant', 'Zone', 'Aisle', 'Bin', 'Part_Number', 'Part_Description',
            'Serial_Number', 'Condition', 'Category', 'Owner', 'Criticality',
            'Unit_of_Measure']


class CustomSearchFilter(filters.SearchFilter):
    """
    Filter that only allows users to see their own objects.
    """
    def filter_queryset(self, request, queryset, view):
        filterset_qty_fields = ['Batch_Number', 'Average_Cost', 'Quantity']
        filterset_iexact_fields = get_fields()
        queryset = queryset.filter(organization=request.query_params.get('organization', -1))

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
                param = {'{0}__{1}'.format(field, 'icontains'): request.query_params[field]}
                queryset = queryset.filter(**param)
        return queryset


class ItemViewSet(LoggingViewset):
    queryset = Item.objects.all().order_by('Batch_Number')
    serializer_class = ItemSerializer
    http_method_names = ['get']
    # pagination
    pagination_class = ItemResultsSetPagination
    # search and filter
    filter_backends = [filters.SearchFilter, CustomSearchFilter]
    search_fields = get_fields()

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([])
        return [permission() for permission in permission_classes]

    @action(detail=False, methods=['GET'], name='Get Items based on the template')
    def template(self, request):
        params = list(request.GET.keys())
        for bad_key in ['page', 'page_size']:
            if bad_key in params:
                params.remove(bad_key)
        for key in params:
            value = request.GET.get(key).split(',')
            if key == 'Aisle':
                for i in range(len(value)):
                    value[i] = int(value[i])
            kwarg = {'{0}__in'.format(key): value}
            self.queryset = self.queryset.filter(**kwarg)
        serializer = self.get_serializer(self.queryset, many=True)
        return Response(serializer.data)
