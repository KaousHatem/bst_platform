# Generated by Django 4.0.3 on 2022-05-21 08:52

from django.db import migrations, models
import django.db.models.deletion


def unit_char_to_model(apps, schema_editor):

    Unit = apps.get_model("logistic", "Unit")

    ProvisionProductRel = apps.get_model("logistic", "ProvisionProductRel")
    
    for provisionProductRel in ProvisionProductRel.objects.all():
        unit,_ = Unit.objects.get_or_create(
            ref=provisionProductRel.unit)
        provisionProductRel.unit = unit.id
        provisionProductRel.save()



class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0018_alter_unitconversion_product'),
    ]

    operations = [
        migrations.RunPython(unit_char_to_model, atomic =False),
        migrations.AlterField(
            model_name='provisionproductrel',
            name='unit',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='logistic.unit'),
        ),
    ]
