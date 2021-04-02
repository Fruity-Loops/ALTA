from rest_framework import serializers
from .models import Organization


class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['org_id', 'org_name', 'address', 'status', 'inventory_items_refresh_job', 'calendar_date', 'file',
                  'ftp_location', 'repeat_interval']
