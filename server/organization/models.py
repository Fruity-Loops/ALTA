from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save
from inventory_item.updater import start_new_job


class Organization(models.Model):
    org_id = models.AutoField(primary_key=True)
    org_name = models.CharField(max_length=256, unique=True)
    address = models.CharField(max_length=256, default="Montreal")
    status = models.BooleanField(default=False)
    inventory_items_refresh_job = models.IntegerField(default=1)


@receiver(post_save, sender=Organization)
def execute_job(instance, **kwargs):
    print('post save callback')
    start_new_job(str(instance.org_id), instance.inventory_items_refresh_job)
