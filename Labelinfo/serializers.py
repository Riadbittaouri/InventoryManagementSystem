from rest_framework import serializers
from .models import Labelinfo


class LabelInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Labelinfo
        fields = ('HandlingUnit', 'Storage_Location',
                  'Storage_Bin', 'Material_Number', 'Quantity')
