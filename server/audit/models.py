from django.db import models
from organization.models import Organization
from inventory_item.models import Item
from user_account.models import CustomUser

class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False, default=0)
 # list of all bins - no doubles
    inventory_items = models.ManyToManyField(Item)#, related_name='itemId') , through='SelectedItems')
    assigned_sk = models.ManyToManyField(CustomUser, default=0)
 #   item_to_sk = models.ManyToManyField(Item, through='ItemToSK')


class ItemToSK(models.Model):
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
 #   bin = models.CharField(max_length=255, blank=True, null=True)
    sk = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
#   assigned_sk = models.ManyToManyField(CustomUser, default=0)
# try   assigned_sk = models.ManyToManyField(CustomUser, through='SKtoBin') to create new table again
