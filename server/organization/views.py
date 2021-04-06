import os
from datetime import date
from rest_framework import generics, status
from rest_framework.response import Response

from django_server.custom_logging import LoggingViewset
from inventory_item.updater import start_new_job
from user_account.permissions import PermissionFactory

from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.pagination import PageNumberPagination

from .serializers import OrganizationSerializer
from .models import Organization
from user_account.models import CustomUser
from .permissions import ValidateOrgMatchesUser

from threading import Thread
from inventory_item.updater import main


class OrganizationSetPagination(PageNumberPagination):
    page_size = 25
    page_size_query_param = 'page_size'
    max_page_size = 1000

class OrganizationViewSet(LoggingViewset):
    """
    API endpoint that allows organizations to be viewed or edited.
    """

    queryset = Organization.objects.all().order_by('org_name')
    serializer_class = OrganizationSerializer
    pagination_class = OrganizationSetPagination

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = PermissionFactory(self.request)
        if self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = factory.get_general_permissions([ValidateOrgMatchesUser])
        else:
            permission_classes = factory.base_sa_permissions
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        data = request.data
        today = date.today()
        date_today = today.strftime("%Y/%m/%d")
        data['calendar_date'] = date_today
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        current_status = instance.status
        if 'status' in request.data:
            patch_status = request.data['status']
            if current_status != patch_status: # Org status changed
                CustomUser.objects.filter(organization=instance.org_id).update(is_active=patch_status)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


class ModifyOrganizationInventoryItemsDataUpdate(generics.GenericAPIView):
    """
    API endpoint that allow a user to update the timing at which
    the Inventory Data is refreshed
    """

    default_refresh_time = 15

    # Note: if other methods are added here, keep in mind that the permissions will need to change
    def get_permissions(self):
        permission_classes = PermissionFactory(self.request).get_general_permissions([])
        return [permission() for permission in permission_classes]

    def post(self, request):
        data = request.data

        org_id = data.get('organization_id')
        new_job_timing = int(data.get('time'))
        new_job_interval = data.get('interval')
        new_ftp_location = data.get('ftpLocation')

        try:
            organization = Organization.objects.get(org_id=org_id)
            if new_job_timing:
                organization.inventory_items_refresh_job = new_job_timing
            if new_job_interval:
                organization.repeat_interval = new_job_interval
            if new_ftp_location:
                organization.ftp_location = new_ftp_location
            organization.save()
            start_new_job(org_id, new_job_timing)
            return Response({'detail': 'Time has been updated'}, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'detail': 'Invalid organization'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ModifyOrganizationInventoryItemFile(generics.GenericAPIView):

    # Note: if other methods are added here, keep in mind that the permissions will need to change
    def get_permissions(self):
        permission_classes = PermissionFactory(self.request).get_general_permissions([])
        return [permission() for permission in permission_classes]

    def post(self, request):
        data = request.data
        org_id = data.get('organization_id')
        file = data.get('file')
        filename = str(org_id) + '.csv'

        # Replace existing file for organization
        os.remove('django_server/org_files/'+filename)
        file.name = str(org_id)+'.csv'
        t = Thread(target=main, args=(org_id,))
        t.start()

        try:
            organization = Organization.objects.get(org_id=org_id)
            organization.file = file
            organization.save()
            return Response({'detail': 'File has been updated'}, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'detail': 'Invalid organization'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
