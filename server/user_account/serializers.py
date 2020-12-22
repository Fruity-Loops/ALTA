from rest_framework import serializers
from .models import CustomUser


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'user_name', 'first_name', 'last_name',
                  'password', 'role', 'email', 'location', 'is_active', 'organization']

    def save(self, **kwargs):
        """
        Overriding the serializer save function in order to
        access the parameters passed in the request
        before saving them in the database.
        In this particular case I'm hashing the password.
        """

        user = CustomUser(
            user_name=self.validated_data['user_name'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name'],
            role=self.validated_data['role'],
            email=self.validated_data['email'],
            location=self.validated_data['location'],
            is_active=self.validated_data['is_active'],
            organization=self.validated_data['organization']
        )

        # hash password
        password = self.validated_data['password']
        user.set_password(password)

        user.save()
        return user


class LoginSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['email', 'password']


class ClientGridSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_name', 'first_name', 'last_name', 'email',
                  'role', 'location', 'is_active', 'id']


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['user_name', 'first_name', 'last_name', 'email']


class UserPasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['password']

    def save(self, **kwargs):
        """
        Overriding the serializer save function in order to
        access the parameters passed in the request
        before saving them in the database.
        In this particular case I'm hashing the password.
        """

        # Retrieving the ID of the user that we are trying to update from the view
        target_user_id = self.context['view'].kwargs['pk']
        user = CustomUser.objects.get(id=target_user_id)

        # hash password
        password = self.validated_data['password']
        user.set_password(password)

        user.save()
        return user


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = []

    def save(self):
        user = None
        can_save = True
        for save_field, value in self.data.items():
            can_save = can_save and self.validated_data[save_field]
        if 'email' in self.data:
            try:
                user = CustomUser.objects.get(email=self.data['email'])
            except:
                user = None
        if can_save:
            if not user:
                user = CustomUser()
            for save_field in self.data:
                if save_field == 'password':
                    user.set_password(value)
                else:
                    setattr(user, save_field, self.data[save_field])
                user.save()
        return user
