import uuid
from djongo import models


# Create your models here.
class AuditTemplate(models.Model):
    template_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.CharField(max_length=512)
    title = models.CharField(max_length=256, blank=True)
    Location = models.JSONField(null=True, blank=True)
    Plant = models.JSONField(null=True, blank=True)
    Zone = models.JSONField(null=True, blank=True)
    Aisle = models.JSONField(null=True, blank=True)
    Bin = models.JSONField(null=True, blank=True)
    Part_Number = models.JSONField(null=True, blank=True)
    Serial_Number = models.JSONField(null=True, blank=True)
    description = models.TextField(blank=True)
    start_date = models.TextField(blank=False)
    repeat_every = models.TextField(null=True, blank=True)
    on_day = models.JSONField(null=True, blank=True)
    for_month = models.JSONField(null=True, blank=True)
    time_zone_utc = models.TextField(blank=False)
    calendar_date = models.CharField(max_length=100)
    organization = models.ForeignKey(to='organization.Organization',
                                     on_delete=models.CASCADE, blank=True, null=True)
