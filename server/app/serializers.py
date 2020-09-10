from rest_framework import serializers

from django.contrib.auth.models import User

class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'id')