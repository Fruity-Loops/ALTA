# Generated by Django 3.0.5 on 2021-06-04 03:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('audit_template', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='audittemplate',
            name='recommendation',
            field=models.BooleanField(default=False),
        ),
    ]
