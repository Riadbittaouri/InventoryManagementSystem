from django.db import models
from django.core.exceptions import ValidationError
from authuser.models import User


def validate_quantity(value):
    if len(str(value)) > 6:
        raise ValidationError('Quantity cannot exceed 6 digits.')


class Transaction(models.Model):
    HandlingUnit = models.CharField(max_length=255, default=1)
    Matricule = models.ForeignKey(User, on_delete=models.CASCADE)
    storage_location = models.CharField(max_length=255)
    storage_bin = models.CharField(max_length=255)
    material_number = models.CharField(max_length=255)
    Quantity = models.IntegerField(validators=[validate_quantity])
    date_transaction = models.DateField()
    hour_transaction = models.TimeField()
    message_choices = [
        ('Scanned', 'Scanned'),
        ('Added Manually', 'Added Manually'),
        ('Position Changed', 'Position Changed'),
        ('Quantity Changed', 'Quantity Changed'),
        # Added new message choice
        ('Position Not Changed', 'Position Not Changed')
    ]
    message = models.CharField(max_length=20, choices=message_choices)
    location_type = models.CharField(
        max_length=2, choices=[('WH', 'WH'), ('SM', 'SM')], default='WH')
