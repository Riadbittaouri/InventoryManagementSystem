from django.db import models


class Labelinfo(models.Model):
    HandlingUnit = models.CharField(
        primary_key=True, max_length=100, unique=True)
    Storage_Location = models.CharField(max_length=100)
    Storage_Bin = models.CharField(max_length=100)
    Material_Number = models.CharField(max_length=100)
    Quantity = models.CharField(max_length=100)

    def __str__(self):
        return self.HandlingUnit
