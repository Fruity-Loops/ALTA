from rest_framework import serializers
# from .models import Audit, SelectedItems
# from inventory_item.serializers import ItemBinSerializer
from .models import Audit


class AuditSerializer(serializers.ModelSerializer):
    # inventory_items = ItemBinSerializer(read_only=True, many=True)

    class Meta:
        model = Audit
        fields = '__all__'

"""
    def create(self, validated_data):
        print("yas queen")
        return True


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

class AssignedSKSerializer(serializers.ModelSerializer):
    class Meta:
        model = Audit
        fields = ['audit_id', 'assigned_sk']
