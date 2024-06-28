# Generated by Django 4.2 on 2024-06-26 10:45

import Transactions.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transactions', '0033_alter_transaction_quantity'),
    ]

    operations = [
        migrations.CreateModel(
            name='Labelinfo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Quantity', models.IntegerField(validators=[Transactions.models.validate_quantity])),
            ],
        ),
        migrations.AlterField(
            model_name='transaction',
            name='Quantity',
            field=models.IntegerField(validators=[Transactions.models.validate_quantity]),
        ),
    ]
