from rest_framework import serializers
from .models import Audit
# from .models import AssignedSK


class AuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = '__all__'


class AssignedSKSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = ['audit_id', 'assigned_sk']
