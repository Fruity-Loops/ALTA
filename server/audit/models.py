from djongo import models
from organization.models import Organization
from inventory_item.models import Item
from user_account.models import CustomUser
from audit_template.models import AuditTemplate

class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization,
                                     on_delete=models.CASCADE,
                                     blank=False,
                                     null=False,
                                     default=0)
    status = models.CharField(max_length=50, default="Pending")
    inventory_items = models.ManyToManyField(Item, blank=True, default=0)
    assigned_sk = models.ManyToManyField(CustomUser, blank=True, default=0)
    template_id = models.ForeignKey(AuditTemplate, on_delete=models.CASCADE, blank=True, null=True)


class ItemToSK(models.Model):
    init_audit = models.ForeignKey(Audit, on_delete=models.CASCADE)
    customuser = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    item_ids = models.JSONField(blank=True, null=True)
    bins = models.JSONField(blank=True, null=True)
