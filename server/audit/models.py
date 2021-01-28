from django.db import models
from inventory_item.models import Item
from audit_template.models import AuditTemplate
#Audit

class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    inventory_items = models.ManyToManyField(Item)
    template_id = models.ForeignKey(AuditTemplate, on_delete=models.CASCADE, blank=True, null=True)
