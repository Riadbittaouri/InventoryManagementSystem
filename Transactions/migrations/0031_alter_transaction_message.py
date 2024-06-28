# Generated by Django 4.2 on 2024-06-25 14:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transactions', '0030_alter_transaction_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='message',
            field=models.CharField(choices=[('Scanned', 'Scanned'), ('Added Manually', 'Added Manually'), ('Position Changed', 'Position Changed'), ('Quantity Changed', 'Quantity Changed'), ('Quantity and Position Changed', 'Quantity and Position Changed')], max_length=40),
        ),
    ]