from django.db import models
from organization.models import Organization


class Item(models.Model):
    _id = models.AutoField(primary_key=True)
    Location = models.CharField(max_length=256)
    Plant = models.CharField(max_length=256)
    Zone = models.CharField(max_length=256)
    Aisle = models.CharField(max_length=256)
    Part_Number = models.CharField(max_length=256)
    Part_Description = models.CharField(max_length=256)
    Serial_Number = models.CharField(max_length=256)
    Condition = models.CharField(max_length=256)
    Category = models.CharField(max_length=256)
    Owner = models.CharField(max_length=256)
    Criticality = models.CharField(max_length=256)
    Average_Cost = models.CharField(max_length=256)
    Quantity = models.IntegerField()
    Unit_of_Measure = models.CharField(max_length=256)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, blank=True, null=True)
