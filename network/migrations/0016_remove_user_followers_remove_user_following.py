# Generated by Django 4.2.3 on 2023-10-06 04:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0015_remove_post_views'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='followers',
        ),
        migrations.RemoveField(
            model_name='user',
            name='following',
        ),
    ]
