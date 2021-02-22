from datetime import date
import numpy as np
from rest_framework import status
from rest_framework.response import Response

from django_server.custom_logging import LoggingViewset
from user_account.permissions import PermissionFactory
from inventory_item.updater import start_new_cron_job, start_new_job_once_at_specific_date
from .permissions import CheckTemplateOrganizationById
from .serializers import AuditTemplateSerializer
from .models import AuditTemplate


class AuditTemplateViewSet(LoggingViewset):
    """
    API endpoint that allows Audit templates to be viewed or created.
    """

    queryset = AuditTemplate.objects.all()
    serializer_class = AuditTemplateSerializer
    http_method_names = ['post', 'get', 'patch', 'delete']

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = PermissionFactory(self.request)
        permission_classes = factory.get_general_permissions([CheckTemplateOrganizationById])
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        name = user.first_name + " " + user.last_name
        today = date.today()
        date_today = today.strftime("%B %d, %Y")
        data['author'] = name
        data['calendar_date'] = date_today
        months = np.array(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug',
                           'sep', 'oct', 'nov', 'dec'])
        week_days = np.array(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'])
        data['for_month'] = months[(np.where(data['for_month']))].tolist()
        data['on_day'] = week_days[(np.where(data['on_day']))].tolist()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        template = serializer.save()

        if data["repeat_every"] is not None:
            start_new_cron_job(template.template_id, data['start_date'], data['time_zone_utc'])
        else:
            start_new_job_once_at_specific_date(template.template_id, data['start_date'],
                                                data['time_zone_utc'])

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset()).filter(
            organization_id=self.request.GET.get("organization", ''))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
