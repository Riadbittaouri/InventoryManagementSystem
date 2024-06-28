# Generated by Django 5.0.3 on 2024-03-29 11:47

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Labelinfo', '0002_remove_labelinfo_id_alter_labelinfo_handlingunit'),
        ('Transactions', '0002_transaction_delete_transactions'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='transaction',
            name='Matricule',
            field=models.ForeignKey(default='123456', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='transaction',
            name='id_Transaction',
            field=models.CharField(default=1, max_length=255, primary_key=True, serialize=False),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='transaction',
            name='HandlingUnit',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Labelinfo.labelinfo'),
        ),
        migrations.AlterField(
            model_name='transaction',
            name='message',
            field=models.CharField(choices=[('S', 'Scanned'), ('M', 'Added Manually')], max_length=20),
        ),
    ]