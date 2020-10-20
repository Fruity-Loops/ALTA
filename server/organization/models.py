from django.db import models


class Organization(models.Model):
    ord_id = models.AutoField(primary_key=True)
    org_name = models.CharField(max_length=256, unique=True)
    status = models.BooleanField(default=False)
