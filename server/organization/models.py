from django.db import models


class Organization(models.Model):
    org_id = models.AutoField(primary_key=True)
    org_name = models.CharField(max_length=256, unique=True)
    address = models.CharField(max_length=256)
    status = models.BooleanField(default=False)
