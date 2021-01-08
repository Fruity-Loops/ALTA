

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('organization', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='organization',
            name='address',
            field=models.CharField(default='Montreal', max_length=256),
        ),
    ]
