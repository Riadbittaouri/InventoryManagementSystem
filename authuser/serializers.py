from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['Matricule', 'first_name', 'last_name', 'password', 'is_staff', 'is_active', 'date_joined', 'last_login']

class UserLoginSerializer(serializers.Serializer):
    Matricule = serializers.CharField(max_length=100)
    password = serializers.CharField(max_length=128)
