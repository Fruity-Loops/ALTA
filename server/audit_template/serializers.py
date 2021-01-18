from rest_framework import serializers
from .models import AuditTemplate


class AuditTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AuditTemplate
        fields = "__all__"
