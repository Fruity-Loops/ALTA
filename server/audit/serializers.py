
from rest_framework import serializers
from inventory_item.serializers import ItemSerializer
from user_account.serializers import UserAuditSerializer
from .models import Audit, BinToSK, Record


class AuditSerializer(serializers.ModelSerializer):

    class Meta:
        model = Audit
        fields = '__all__'


class GetAuditSerializer(serializers.ModelSerializer):
    inventory_items = ItemSerializer(read_only=True, many=True)
    assigned_sk = UserAuditSerializer(read_only=True, many=True)

    class Meta:
        model = Audit
        fields = '__all__'


class GetBinToSKSerializer(serializers.ModelSerializer):
    customuser = UserAuditSerializer(read_only=True, many=False)
    init_audit = AuditSerializer(read_only=True, many=False)

    class Meta:
        model = BinToSK
        fields = '__all__'


class PostBinToSKSerializer(serializers.ModelSerializer):

    class Meta:
        model = BinToSK
        fields = '__all__'

class RecordSerializer(serializers.ModelSerializer):

    class Meta:
        model = Record
        fields = "__all__"
