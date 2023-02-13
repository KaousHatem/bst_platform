# Generated by Django 4.0.3 on 2023-02-13 09:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('project', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='address',
            field=models.CharField(max_length=220, null=True),
        ),
        migrations.AlterField(
            model_name='location',
            name='codePostal',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
