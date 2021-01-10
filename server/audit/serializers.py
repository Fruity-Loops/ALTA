from rest_framework import serializers
from .models import Audit
from inventory_item.serializers import ItemSerializer
from user_account.serializers import UserAuditSerializer


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

"""
# Might need this for posting BinToSk data

class SelectedItemsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SelectedItems
        fields = '__all__'

    def create(self, validated_data):
        # create Audit object
        audit = Audit.objects.create(**validated_data.get('_id'))

        #create Item object
        item = Item.objects.create(**validated_data.get('_id'))

        #create SelectedItems object
        selected_item = SelectedItems.objects.create(
            audit=audit, item=item
        )
        return selected_item
"""
