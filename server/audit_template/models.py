import uuid
from djongo import models


# Create your models here.
class AuditTemplate(models.Model):
    template_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.CharField(max_length=512)
    title = models.CharField(max_length=256, blank=True)
    location = models.JSONField(null=True, blank=True)
    plant = models.JSONField(null=True, blank=True)
    zones = models.JSONField(null=True, blank=True)
    aisles = models.JSONField(null=True, blank=True)
    bins = models.JSONField(null=True, blank=True)
    part_number = models.JSONField(null=True, blank=True)
    serial_number = models.JSONField(null=True, blank=True)
    description = models.TextField(blank=True)
    start_date = models.TextField(blank=False)
    repeat_every = models.TextField(null=True, blank=True)
    on_day = models.JSONField(null=True, blank=True)
    for_month = models.JSONField(null=True, blank=True)
    time_zone_utc = models.TextField(blank=False)
    calendar_date = models.CharField(max_length=100)
    organization = models.ForeignKey(to='organization.Organization',
                                     on_delete=models.CASCADE, blank=True, null=True)
