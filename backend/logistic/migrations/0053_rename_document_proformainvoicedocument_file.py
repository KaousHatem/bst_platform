# Generated by Django 4.0.3 on 2023-02-21 10:15

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0052_remove_proformainvoice_proformasupplierref'),
    ]

    operations = [
        migrations.RenameField(
            model_name='proformainvoicedocument',
            old_name='document',
            new_name='file',
        ),
    ]
