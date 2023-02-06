# Generated by Django 4.0.3 on 2023-02-06 09:03

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('logistic', '0046_alter_stock_quantity_alter_stockin_quantity_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='stockin',
            name='note',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AddField(
            model_name='stockout',
            name='note',
            field=models.CharField(blank=True, max_length=500, null=True),
        ),
        migrations.AlterField(
            model_name='stock',
            name='updated_by',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='stockin',
            name='source',
            field=models.CharField(choices=[('0', 'PURCHASE'), ('1', 'CASH_PURCHASE'), ('2', 'TRANSFER'), ('2', 'OTHER')], max_length=22, verbose_name='source'),
        ),
    ]