from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'user_name', 'first_name', 'last_name', 'password', 'role', 'email', 'is_active']

    def save(self):
        """
        Overriding the serializer save function in order to access the parameters passed in the request
        before saving them in the database.
        In this particular case I'm hashing the password.
        """

        user = CustomUser(
            user_name=self.validated_data['user_name'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
            role=self.validated_data['role'],
            email=self.validated_data['email'],
            is_active=self.validated_data['is_active']
        )

        # hash password
        password = self.validated_data['password']
        user.set_password(password)

        user.save()
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['username', 'password']
