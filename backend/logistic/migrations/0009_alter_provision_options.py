# Generated by Django 4.0.3 on 2022-04-18 08:55

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0008_alter_provision_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='provision',
            options={'ordering': ('id',), 'permissions': (('can_approve_provision', 'Can approve provision'),)},
        ),
    ]