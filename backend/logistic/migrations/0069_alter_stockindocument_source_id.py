# Generated by Django 4.0.3 on 2023-05-19 15:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0068_stockindocument_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockindocument',
            name='source_id',
            field=models.CharField(max_length=50, null=True),
        ),
    ]