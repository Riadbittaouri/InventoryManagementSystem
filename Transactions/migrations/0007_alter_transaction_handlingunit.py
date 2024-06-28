# Generated by Django 5.0.3 on 2024-04-01 15:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Labelinfo', '0002_remove_labelinfo_id_alter_labelinfo_handlingunit'),
        ('Transactions', '0006_alter_transaction_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='HandlingUnit',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Labelinfo.labelinfo'),
        ),
    ]
