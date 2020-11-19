# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class InventoryItemItem(models.Model):
    aisle = models.CharField(db_column='Aisle')  # Field name made lowercase.
    average_cost = models.CharField(db_column='Average_Cost')  # Field name made lowercase.
    category = models.CharField(db_column='Category')  # Field name made lowercase.
    condition = models.CharField(db_column='Condition')  # Field name made lowercase.
    criticality = models.CharField(db_column='Criticality')  # Field name made lowercase.
    location = models.CharField(db_column='Location')  # Field name made lowercase.
    owner = models.CharField(db_column='Owner')  # Field name made lowercase.
    part_description = models.CharField(db_column='Part_Description')  # Field name made lowercase.
    part_number = models.CharField(db_column='Part_Number')  # Field name made lowercase.
    plant = models.TextField(db_column='Plant')  # Field name made lowercase. This field type is a guess.
    quantity = models.CharField(db_column='Quantity')  # Field name made lowercase.
    serial_number = models.CharField(db_column='Serial_Number')  # Field name made lowercase.
    unit_of_measure = models.CharField(db_column='Unit_of_Measure')  # Field name made lowercase.
    zone = models.CharField(db_column='Zone')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'inventory_item_item'
