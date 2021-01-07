from rest_framework import viewsets
from rest_framework import filters
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination

from django.db.models import CharField
from django.db.models.functions import Cast

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

class CustomSearchFilter(filters.SearchFilter):
    """
    Filter that only allows users to see their own objects.
    """

    # def get_search_fields(self, view, request):
        # if request.query_params.get('search'):
        #     return ['Zone']
        # return super(CustomSearchFilter, self).get_search_fields(view, request)
    def filter_queryset(self, request, queryset, view):
        # filterset_fields = ['_id', 'Location', 'Zone', 'Aisle', 'Part_Number', 'Serial_Number',
        #                     'Condition', 'Category', 'Owner', 'Average_Cost', 'Quantity',
        #                     'Unit_of_Measure']
        # filtervar = 'Zone__iexact'
        if '_id_from' in request.query_params:
            queryset = queryset.filter(_id__gte=request.query_params['_id_from'])
        if '_id_to' in request.query_params:
            queryset = queryset.filter(_id__lte=request.query_params['_id_to'])
        if 'Average_Cost_from' in request.query_params:
            queryset = queryset.filter(Average_Cost__gte=request.query_params['Average_Cost_from'])
        if 'Average_Cost_to' in request.query_params:
            queryset = queryset.filter(Average_Cost__lte=request.query_params['Average_Cost_to'])
        if 'Quantity_from' in request.query_params:
            queryset = queryset.filter(Quantity__gte=request.query_params['Quantity_from'])
        if 'Quantity_to' in request.query_params:
            queryset = queryset.filter(Quantity__lte=request.query_params['Quantity_to'])
        # f'{filtervar}iexact'
            # filtervar+='__iexact'
            # queryvar = request.query_params['Zone']
            # f = f'{filtervar}="{queryvar}"'
            # f = 'Zone__iexact="b"'
            # queryset = eval('queryset.filter('+f+')')
        # if 'Location' in request.query_params:
        #     queryset = queryset.filter(Location=request.query_params['Location'])


        return queryset



class ItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """
    queryset = Item.objects.all().order_by('_id')

    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']
    # pagination
    pagination_class = ItemResultsSetPagination
    #search
    filter_backends = [filters.SearchFilter, CustomSearchFilter]
    search_fields = ['Location', 'Zone', 'Part_Number', 'Part_Description', 'Serial_Number', 'Condition', 'Category',
                     'Owner', 'Average_Cost', 'Unit_of_Measure']
    # filter
    filterset_fields = ['_id', 'Location', 'Zone', 'Aisle', 'Part_Number', 'Serial_Number',
                        'Condition', 'Category', 'Owner', 'Average_Cost', 'Quantity',
                        'Unit_of_Measure']

