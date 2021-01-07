from django.db import models
from inventory_item.models import Item
from user_account.models import CustomUser


class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    inventory_items = models.ManyToManyField(Item)


class AssignedSK(models.Model):
    _id_id = models.AutoField(primary_key=True)
    audit_id = models.ForeignKey(Audit, on_delete=models.CASCADE, blank=True, null=True)
    assigned_sk = models.ManyToManyField(CustomUser)

