# Generated by Django 4.0.3 on 2022-10-06 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0031_alter_stock_updated_by'),
    ]

    operations = [
        migrations.AlterField(
            model_name='receiptproductrel',
            name='conformity',
            field=models.BooleanField(blank=True, default=True, null=True),
        ),
    ]
