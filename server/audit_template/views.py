from datetime import date
import numpy as np
import itertools as it
from itertools import chain

from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from user_account.permissions import IsSystemAdmin
from .permissions import IsInventoryManagerTemplate
from .serializers import AuditTemplateSerializer
from .models import AuditTemplate
from inventory_item.models import Item
from audit.models import Audit
from inventory_item.updater import start_new_cron_job, start_new_job_once_at_specific_date


class AuditTemplateViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Audit templates to be viewed or created.
    """

    queryset = AuditTemplate.objects.all()
    serializer_class = AuditTemplateSerializer
    permission_classes = [IsAuthenticated, IsInventoryManagerTemplate | IsSystemAdmin]
    http_method_names = ['post', 'get', 'patch', 'delete']

    def create(self, request, *args, **kwargs):
        data = request.data
        user = request.user
        name = user.first_name + " " + user.last_name
        today = date.today()
        date_today = today.strftime("%B %d, %Y")
        data['author'] = name
        data['calendar_date'] = date_today
        months = np.array(['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'])
        week_days = np.array(['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'])
        data['for_month'] = months[(np.where(data['for_month']))].tolist()
        data['on_day'] = week_days[(np.where(data['on_day']))].tolist()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        template = serializer.save()

        if data["repeat_every"] is not None:
            start_new_cron_job(template.template_id, data['start_date'], data['time_zone_utc'])
        else:
            start_new_job_once_at_specific_date(template.template_id, data['start_date'], data['time_zone_utc'])

        return Response(status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset()).filter(
            organization_id=self.request.GET.get("organization", ''))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
