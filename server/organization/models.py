from django.db import models
from django.dispatch import receiver
from django.db.models.signals import post_save


class Organization(models.Model):
    org_id = models.AutoField(primary_key=True)
    org_name = models.CharField(max_length=256, unique=True)
    status = models.BooleanField(default=False)
    inventory_items_refresh_job = models.IntegerField(default=1)


@receiver(post_save, sender=Organization)
def execute_job(sender, instance, **kwargs):
    print('post save callback')
    start_new_job(instance.org_name, instance.inventory_items_refresh_job)
