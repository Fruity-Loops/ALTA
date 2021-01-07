from djongo import models


# Create your models here.
class AuditTemplate(models.Model):
    template_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=256, blank=True)
    location = models.JSONField(max_length=256, blank=True)
    plant = models.JSONField(max_length=256, blank=True)
    zones = models.JSONField(null=True, blank=True)
    aisles = models.JSONField(null=True, blank=True)
    bins = models.JSONField(null=True, blank=True)
    part_number = models.JSONField(max_length=256, blank=True)
    serial_number = models.JSONField(max_length=256, blank=True)
    description = models.TextField(blank=True)
