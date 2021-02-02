from django.db import models

class ItemFields(models.Model):
    DEFAULT_FIELD = 'N/A'
    Location = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Plant = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Zone = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Aisle = models.IntegerField(null=True)
    Bin = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Part_Number = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Part_Description = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Serial_Number = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Condition = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Category = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Owner = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Criticality = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Average_Cost = models.CharField(max_length=256, default=DEFAULT_FIELD)
    Quantity = models.IntegerField(null=True)
    Unit_of_Measure = models.CharField(max_length=256, default=DEFAULT_FIELD)

    class Meta:
        abstract = True

class Item(ItemFields):
    _id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(to='organization.Organization',
                                     on_delete=models.CASCADE, blank=True, null=True)
