# Generated by Django 5.0.3 on 2024-04-02 09:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transactions', '0008_transaction_scanned_handling_unit'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transaction',
            name='id_Transaction',
        ),
        migrations.AddField(
            model_name='transaction',
            name='id',
            field=models.AutoField(default=1, primary_key=True, serialize=False),
        ),
    ]
