# Generated by Django 4.0.3 on 2023-05-18 10:36

from django.db import migrations, models
import django.db.models.deletion
import logistic.models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0062_alter_stockindocumentsourcefile_file_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='stockindocumentfile',
            name='file',
            field=models.FileField(upload_to=logistic.models._upload_to_stock_in),
        ),
        migrations.AlterField(
            model_name='stockindocumentfile',
            name='stock_in_document',
            field=models.ForeignKey(on_delete=django.db.models.deletion.DO_NOTHING, related_name='file', to='logistic.stockindocument'),
        ),
    ]
