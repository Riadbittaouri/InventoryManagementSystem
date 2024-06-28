# Generated by Django 4.2 on 2024-04-17 08:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('Transactions', '0014_remove_transaction_scanned_handling_unit_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='Matricule',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]