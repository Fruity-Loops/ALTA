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
    def filter_queryset(self, request, queryset, view):
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
        if 'Location' in request.query_params:
            queryset = queryset.filter(Location__iexact=request.query_params['Location'])
        if 'Plant' in request.query_params:
            queryset = queryset.filter(Plant__iexact=request.query_params['Plant'])
        if 'Zone' in request.query_params:
            queryset = queryset.filter(Zone__iexact=request.query_params['Zone'])
        if 'Aisle' in request.query_params:
            queryset = queryset.filter(Aisle__iexact=request.query_params['Aisle'])
        if 'Part_Number' in request.query_params:
            queryset = queryset.filter(Part_Number__iexact=request.query_params['Part_Number'])
        if 'Serial_Number' in request.query_params:
            queryset = queryset.filter(Serial_Number__iexact=request.query_params['Serial_Number'])
        if 'Condition' in request.query_params:
            queryset = queryset.filter(Condition__iexact=request.query_params['Condition'])
        if 'Category' in request.query_params:
            queryset = queryset.filter(Category__iexact=request.query_params['Category'])
        if 'Owner' in request.query_params:
            queryset = queryset.filter(Owner__iexact=request.query_params['Owner'])
        if 'Unit_of_Measure' in request.query_params:
            queryset = queryset.filter(Unit_of_Measure__iexact=request.query_params['Unit_of_Measure'])

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
    search_fields = ['Location', 'Zone', 'Plant', 'Part_Number', 'Part_Description', 'Serial_Number', 'Condition',
                     'Category', 'Owner', 'Unit_of_Measure']
    # filter
    filterset_fields = ['_id', 'Location', 'Zone', 'Aisle', 'Part_Number', 'Serial_Number',
                        'Condition', 'Category', 'Owner', 'Average_Cost', 'Quantity',
                        'Unit_of_Measure']

