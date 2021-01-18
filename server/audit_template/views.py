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
        template_id = serializer.save()

        # # Query to get inventory items
        # dict = {}
        # categories = ['Location', 'Plant', 'Zone', 'Aisle', 'Bin', 'Part_Number', 'Serial_Number']
        # for list, category in zip(
        #         [data['location'], data['plant'], data['zones'], data['aisles'], data['bins'], data['part_number'],
        #          data['serial_number']], categories):
        #     # print(category + ' '+str(len(list)))
        #     if len(list):
        #         dict[category] = list
        #
        # # print(dict)
        # sorted_keys = sorted(dict.keys())
        # # print(sorted_keys)
        # all_categories = sorted(dict)
        # combinations = it.product(*(dict[category] for category in all_categories))
        # results = [x for x in combinations]  # converting th3 itertools object to a list
        # # print(results)
        # # print(type(results))
        # # Location = 'YYC', Plant = 'Plant 2', Zone = 'B', Aisle = 3.0, Bin = 'A10', Part_Number = 'PART-4', Serial_Number = 'SN-4'
        # kwargs = {}
        # inventory_items_to_audit = []
        # for query in results:
        #     for category, value in zip(sorted_keys, query):
        #         kwargs[category] = value
        #     inventory_items = Item.objects.filter(**kwargs)
        #     # print(inventory_items)
        #     for i in range(len(inventory_items)):
        #         inventory_items_to_audit.append(inventory_items[i]._id)
        #     # inventory_items_to_audit = chain(inventory_items_to_audit, inventory_items)  #concatinating querysets objects
        #
        # # Creating the Audit and appending the template ID to it as well as the items
        # audit = Audit(template_id=template_id)
        # audit.save()
        #
        # # Didnt find another way of adding the list directly in the ManytoManyfield
        # for item in inventory_items_to_audit:
        #     audit.inventory_items.add(item)


        if data["repeat_every"] != null:
            # Schedule the audit by starting a cron job
            start_new_cron_job(template_id)
        else:
            start_new_job_once_at_specific_date(template_id, data['start_date'], data['time_zone_utc'])

        return Response(status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.filter_queryset(self.get_queryset()).filter(
            organization_id=self.request.GET.get("organization", ''))

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
