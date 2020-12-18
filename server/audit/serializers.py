from rest_framework import serializers
from .models import Audit


class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = '__all__'
