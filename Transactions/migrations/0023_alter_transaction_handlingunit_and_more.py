# Generated by Django 4.2 on 2024-05-06 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Transactions', '0022_alter_transaction_quantity'),
    ]

    operations = [
        migrations.AlterField(
            model_name='transaction',
            name='HandlingUnit',
            field=models.CharField(default='', max_length=255),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='Quantity',
            field=models.IntegerField(),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='date_transaction',
            field=models.DateField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='hour_transaction',
            field=models.TimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='message',
            field=models.CharField(choices=[('Scanned', 'Scanned'), ('Added Manually', 'Added Manually'), ('Position Changed', 'Position Changed')], default='Scanned', max_length=20),
        ),
    ]
