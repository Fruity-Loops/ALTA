from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'user_name', 'first_name', 'last_name', 'password', 'role', 'email']
        extra_kwargs = {
            'password': {'write_only': True}
        }


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password']
