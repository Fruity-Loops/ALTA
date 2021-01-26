from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from inventory_item.updater import start_new_job


class Organization(models.Model):
    org_id = models.AutoField(primary_key=True)
    org_name = models.CharField(max_length=256, unique=True)
    address = models.CharField(max_length=256, default="None")
    status = models.BooleanField(default=False)
    inventory_items_refresh_job = models.IntegerField(default=1)
    calendar_date = models.CharField(max_length=100)


@receiver(post_save, sender=Organization)
def execute_job(instance, **kwargs):

    # If the signal is triggered by a fixture then the 'raw' argument is set
    # We add this check to avoid creating jobs by fixture loading data in tests
    if kwargs.get('created', True) and not kwargs.get('raw', False):
        start_new_job(str(instance.org_id), instance.inventory_items_refresh_job)
