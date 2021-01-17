from django.db import models
from djongo import models
from organization.models import Organization
from inventory_item.models import Item
from user_account.models import CustomUser

class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False, default=0)
    inventory_items = models.ManyToManyField(Item)
    assigned_sk = models.ManyToManyField(CustomUser, blank=True, default=0)


class ItemToSK(models.Model):
    init_audit = models.ForeignKey(Audit, on_delete=models.CASCADE)
    customuser = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    item_ids = models.JSONField(blank=True, null=True)
    bins = models.JSONField(blank=True, null=True)

