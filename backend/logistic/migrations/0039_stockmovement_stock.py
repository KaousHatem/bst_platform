# Generated by Django 4.0.3 on 2022-10-19 08:49

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0038_stockmovement_created_on_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='stockmovement',
            name='stock',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='stock_movement', to='logistic.stock'),
        ),
    ]
