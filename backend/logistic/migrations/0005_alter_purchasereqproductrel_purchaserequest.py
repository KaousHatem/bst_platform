# Generated by Django 4.0.3 on 2022-04-07 08:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0004_purchaserequest_approved_on'),
    ]

    operations = [
        migrations.AlterField(
            model_name='purchasereqproductrel',
            name='purchaseRequest',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='purchaseReqProducts', to='logistic.purchaserequest'),
        ),
    ]
