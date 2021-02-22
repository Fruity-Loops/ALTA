# Generated by Django 3.0.5 on 2021-02-22 01:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Organization',
            fields=[
                ('org_id', models.AutoField(primary_key=True, serialize=False)),
                ('org_name', models.CharField(max_length=256, unique=True)),
                ('address', models.CharField(default='None', max_length=256)),
                ('status', models.BooleanField(default=False)),
                ('inventory_items_refresh_job', models.IntegerField(default=1)),
                ('calendar_date', models.CharField(max_length=100)),
            ],
        ),
    ]
