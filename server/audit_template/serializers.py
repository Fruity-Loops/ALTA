from rest_framework import serializers
from .models import AuditTemplate


class AuditTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditTemplate
        fields = ['template_id', 'title', 'location', 'plant', 'zones', 'aisles', 'bins',
                  'part_number', 'serial_number', 'description', 'startDateObj', 'repeatEvery',
                  'onDay', 'forMonth', 'timeZoneUTC', 'author', 'calendar_date', 'organization']
