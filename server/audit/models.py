from djongo import models
from inventory_item.models import Item, ItemFields
from audit_template.models import AuditTemplate
USER_MODEL = 'user_account.CustomUser'

PENDING = 'Pending'
COMPLETE = 'Complete'

class Audit(models.Model):
    audit_id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(to='organization.Organization',
                                     on_delete=models.CASCADE,
                                     blank=False,
                                     null=False,
                                     default=0)
    inventory_items = models.ManyToManyField(Item, blank=True, default=0)
    assigned_sk = models.ManyToManyField(to='user_account.CustomUser', blank=True, default=0)
    initiated_by = models.ForeignKey(
        to=USER_MODEL,
        on_delete=models.CASCADE,
        related_name='initiated_by')
    initiated_on = models.DateTimeField(auto_now_add=True) # Auto set when object is first created
    last_modified_on = models.DateTimeField(auto_now=True) # Auto set every time object is saved
    assigned_sk = models.ManyToManyField(to=USER_MODEL, blank=True, default=0)
    template_id = models.ForeignKey(AuditTemplate, on_delete=models.CASCADE, blank=True, null=True)
    accuracy = models.FloatField(default=0.0)

    ACTIVE = 'Active'

    AUDIT_STATUS = [(
        PENDING, 'Pending'),
        (COMPLETE, 'Complete'),
        (ACTIVE, 'Active')
    ]
    status = models.CharField(max_length=12, choices=AUDIT_STATUS, default=PENDING)


class BinToSK(models.Model):
    bin_id = models.AutoField(primary_key=True)
    Bin = models.CharField(max_length=256, blank=False, null=False)
    init_audit = models.ForeignKey(Audit, on_delete=models.CASCADE)
    customuser = models.ForeignKey(to=USER_MODEL, on_delete=models.CASCADE)
    item_ids = models.JSONField(blank=True, null=True)
    accuracy = models.FloatField(default=0.0)

    BIN_STATUS = [(
        PENDING, 'Pending'),
        (COMPLETE, 'Complete'),
    ]
    status = models.CharField(max_length=12, choices=BIN_STATUS, default=PENDING)

class Record(ItemFields):
    record_id = models.AutoField(primary_key=True)
    item_id = models.CharField(max_length=256, null=False)
    audit=models.ForeignKey(Audit, on_delete=models.CASCADE)
    bin_to_sk=models.ForeignKey(BinToSK, on_delete=models.CASCADE)
    comment = models.TextField(blank=True)
    flagged = models.BooleanField(default=False)
    first_verified_on = models.DateTimeField(auto_now_add=True)
    last_verified_on = models.DateTimeField(auto_now=True)

    PROVIDED = 'Provided'
    MISSING = 'Missing'
    NEW = 'New'

    RECORD_STATUS = [
        (PENDING, 'Pending'),
        (PROVIDED, 'Provided'),
        (MISSING, 'Missing'),
        (NEW, 'New')
    ]
    status = models.CharField(max_length=8, choices=RECORD_STATUS,default=PENDING)
