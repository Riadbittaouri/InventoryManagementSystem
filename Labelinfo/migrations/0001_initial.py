# Generated by Django 5.0.3 on 2024-03-28 11:58

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Labelinfo',
            fields=[
                ('id', models.AutoField(default=None, primary_key=True, serialize=False)),
                ('HandlingUnit', models.CharField(max_length=100, unique=True)),
                ('Storage_Location', models.CharField(max_length=100)),
                ('Storage_Bin', models.CharField(max_length=100)),
                ('Material_Number', models.CharField(max_length=100)),
                ('Quantity', models.IntegerField()),
            ],
        ),
    ]
