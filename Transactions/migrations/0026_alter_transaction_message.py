# Generated by Django 4.2 on 2024-05-13 12:53

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transactions', '0025_alter_transaction_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='message',
            field=models.CharField(choices=[('Scanned', 'Scanned'), ('Added Manually', 'Added Manually'), ('Position Changed', 'Position Changed'), ('Quantity Changed', 'Quantity Changed')], max_length=20),
        ),
    ]
