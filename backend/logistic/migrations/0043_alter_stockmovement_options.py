# Generated by Django 4.0.3 on 2022-10-19 14:16

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0042_alter_stockmovement_options_alter_stockout_target'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='stockmovement',
            options={'ordering': ('-created_on',)},
        ),
    ]
