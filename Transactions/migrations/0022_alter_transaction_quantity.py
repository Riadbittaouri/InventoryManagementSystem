# Generated by Django 4.2 on 2024-04-29 16:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transactions', '0021_alter_transaction_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='Quantity',
            field=models.TextField(),
        ),
    ]
