# Generated by Django 3.0.5 on 2021-04-02 00:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('audit', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='assignment',
            name='seen_on',
            field=models.DateTimeField(auto_now=True),
        ),
    ]