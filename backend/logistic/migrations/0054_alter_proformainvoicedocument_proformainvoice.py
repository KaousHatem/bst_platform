# Generated by Django 4.0.3 on 2023-02-21 10:29

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0053_rename_document_proformainvoicedocument_file'),
    ]

    operations = [
        migrations.AlterField(
            model_name='proformainvoicedocument',
            name='proformaInvoice',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='document', to='logistic.proformainvoice'),
        ),
    ]
