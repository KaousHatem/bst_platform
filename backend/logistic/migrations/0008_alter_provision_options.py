# Generated by Django 4.0.3 on 2022-04-18 08:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0007_alter_purchaserequest_approved_on'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='provision',
            options={'ordering': ('id',), 'permissions': (('can_approve', 'Can approve'),)},
        ),
    ]