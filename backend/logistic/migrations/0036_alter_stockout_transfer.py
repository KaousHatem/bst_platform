# Generated by Django 4.0.3 on 2022-10-18 11:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0035_stockinit'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockout',
            name='transfer',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='logistic.transfer'),
        ),
    ]
