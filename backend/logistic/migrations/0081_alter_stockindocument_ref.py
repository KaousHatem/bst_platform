# Generated by Django 4.0.3 on 2023-07-06 09:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0080_alter_stockindocumentfile_stock_in_document'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockindocument',
            name='ref',
            field=models.CharField(max_length=20, null=True),
        ),
    ]
