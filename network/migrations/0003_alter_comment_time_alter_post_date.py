# Generated by Django 4.2.3 on 2023-09-04 02:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0002_comment_post_following'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='time',
            field=models.DateField(auto_now=True),
        ),
        migrations.AlterField(
            model_name='post',
            name='date',
            field=models.DateField(auto_now=True),
        ),
    ]
