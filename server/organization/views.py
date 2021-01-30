from datetime import date
from rest_framework import viewsets, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from inventory_item.updater import start_new_job
from user_account.permissions import IsInventoryManager, IsSystemAdmin, HasSameOrgInBody, PermissionFactory

from .serializers import OrganizationSerializer
from .models import Organization
from .permissions import ValidateOrgMatchesUser


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows organizations to be viewed or edited.
    """

    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        factory = PermissionFactory(self.request)
        if self.action in ['retrieve', 'update', 'partial_update']:
            permission_classes = factory.get_general_permissions([ValidateOrgMatchesUser])
        else:
            permission_classes = factory.baseSAPermissions
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        data = request.data
        today = date.today()
        date_today = today.strftime("%Y/%m/%d")
        data['calendar_date'] = date_today
        return super().create(request, *args, **kwargs)


class ModifyOrganizationInventoryItemsDataUpdate(generics.GenericAPIView):
    """
    API endpoint that allow a user to update the timing at which
    the Inventory Data is refreshed
    """

    # Note: if other methods are added here, keep in mind that the permissions will need to change
    permission_classes = [IsAuthenticated, IsSystemAdmin | (IsInventoryManager, HasSameOrgInBody)]

    def post(self, request):
        data = request.data
        org_id = data.get('organization', '')
        new_job_timing = int(data.get('new_job_timing', ''))

        try:
            organization = Organization.objects.get(org_id=org_id)
            organization.inventory_items_refresh_job = new_job_timing
            organization.save()
            start_new_job(org_id, new_job_timing)
            return Response({'detail': 'Time has been updated'}, status=status.HTTP_200_OK)

        except Organization.DoesNotExist:
            return Response({'detail': 'Invalid organization'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
