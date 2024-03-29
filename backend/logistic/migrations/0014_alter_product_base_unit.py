# Generated by Django 4.0.3 on 2022-04-25 10:27

from django.db import migrations, models
import django.db.models.deletion


def unit_char_to_model(apps, schema_editor):

    Unit = apps.get_model("logistic", "Unit")

    Product = apps.get_model("logistic", "Product")
    
    for product in Product.objects.all():
        unit,_ = Unit.objects.get_or_create(
            ref=product.base_unit)
        product.base_unit = unit.id
        product.save()


class Migration(migrations.Migration):

    dependencies = [
        ('logistic', '0013_rename_unit_product_base_unit'),
    ]

    operations = [
        
        migrations.RunPython(unit_char_to_model, atomic =False),
        migrations.AlterField(
            model_name='product',
            name='base_unit',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='logistic.unit'),
        ),
    ]
