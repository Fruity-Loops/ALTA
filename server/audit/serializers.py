
from rest_framework import serializers
from inventory_item.serializers import ItemSerializer
from user_account.serializers import UserAuditSerializer
from .models import Audit, BinToSK
from rest_framework.fields import empty


class AuditSerializer(serializers.ModelSerializer):
    inventory_items = ItemSerializer(read_only=True, many=True)
    assigned_sk = UserAuditSerializer(read_only=True, many=True)

    class Meta:
        model = Audit
        fields = "__all__"
        remove_fields = []
        restore_fields = []

    def __init__(self, instance=None, data=empty, **kwargs):
        for dictionary in self.Meta.restore_fields:
            AuditSerializer._declared_fields.update(dictionary)
        self.Meta.restore_fields = []
        for field in self.Meta.remove_fields:
            self.Meta.restore_fields.append({field: self._declared_fields.pop(field)})
        super().__init__(instance, data, **kwargs)


class BinItemSerializer(serializers.ModelSerializer):
    inventory_item = ItemSerializer(read_only=True, many=True)
    customuser = UserAuditSerializer(read_only=True, many=False)

    class Meta:
        model = BinToSK
        fields = "__all__"
        remove_fields = []
        restore_fields = []

    def __init__(self, instance=None, data=empty, **kwargs):
        for dictionary in self.Meta.restore_fields:
            BinItemSerializer._declared_fields.update(dictionary)
        self.Meta.restore_fields = []
        for field in self.Meta.remove_fields:
            self.Meta.restore_fields.append({field: self._declared_fields.pop(field)})
        super().__init__(instance, data, **kwargs)