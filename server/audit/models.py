from django.db import models
from inventory_item.models import Item


class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    inventory_items = models.ManyToManyField(Item)
