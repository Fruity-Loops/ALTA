from django.db import models
from jsonfield import JSONField
from organization.models import Organization
from inventory_item.models import Item
from user_account.models import CustomUser

class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
  #  org = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False, default=0)
    inventory_items = models.ManyToManyField(Item, through='SelectedItems')
  #  assigned_sk = models.ManyToManyField(CustomUser, default=0)

class SelectedItems(models.Model):
    audit = models.ForeignKey(Audit, on_delete=models.CASCADE)
    item = models.ForeignKey(Item, on_delete=models.CASCADE)
    bin = models.CharField(max_length=256, blank=False, null=False, default=0)
    assigned_sk = models.ManyToManyField(CustomUser, default=0)
# try   assigned_sk = models.ManyToManyField(CustomUser, through='SKtoBin') to create new table again