# Generated by Django 4.2.3 on 2023-09-04 05:35

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0008_alter_post_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='following',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creator', to=settings.AUTH_USER_MODEL, unique=True),
        ),
    ]
