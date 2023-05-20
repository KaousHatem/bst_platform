# Generated by Django 4.0.3 on 2023-05-18 09:18

from django.db import migrations, models
import django.db.models.deletion
import logistic.models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0060_remove_stockindocument_quantity'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='stockindocument',
            name='source_document',
        ),
        migrations.RemoveField(
            model_name='stockindocument',
            name='stock_in_document',
        ),
        migrations.CreateModel(
            name='StockInDocumentSourceFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, null=True, upload_to=logistic.models._upload_to_stock_in)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('stock_in_document', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='source_file', to='logistic.stockindocument')),
            ],
        ),
        migrations.CreateModel(
            name='StockInDocumentFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(blank=True, null=True, upload_to=logistic.models._upload_to_stock_in)),
                ('created_on', models.DateTimeField(auto_now_add=True)),
                ('stock_in_document', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='file', to='logistic.stockindocument')),
            ],
        ),
    ]