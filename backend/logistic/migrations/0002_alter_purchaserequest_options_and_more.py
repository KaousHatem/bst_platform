# Generated by Django 4.0.3 on 2022-04-06 11:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0001_initial'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='purchaserequest',
            options={'ordering': ('id',)},
        ),
        migrations.AlterField(
            model_name='purchaserequest',
            name='status',
            field=models.CharField(choices=[('0', 'DRAFT'), ('1', 'NEW'), ('4', 'DROP'), ('9', 'APPROVED')], default='new', max_length=220, verbose_name='status'),
        ),
    ]
