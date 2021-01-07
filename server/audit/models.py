from django.db import models
from inventory_item.models import Item
from user_account.models import CustomUser
from organization.models import Organization


class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    org = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=False, null=False, default=0)
    inventory_items = models.ManyToManyField(Item)
    assigned_sk = models.ManyToManyField(CustomUser, default=0)

