from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import CustomUser


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = []

    def save(self):  # pylint: disable=arguments-differ
        user = None
        data = dict(self.validated_data)
        try:
            if self.context:
                user = CustomUser.objects.get(pk=self.context)
        except ObjectDoesNotExist:
            pass
        if 'user_name' in data and 'email' in data and not user:
            if data['user_name'] and data['email']:
                user = CustomUser()
        if user:
            self.save_password(user, data)
            for save_field in data:
                setattr(user, save_field, data[save_field])
            user.save()
        return user

    def save_password(self, user, data): # pylint: disable=no-self-use
        if 'password' in data:
            if data['password']:
                user.set_password(data['password'])
            del data['password']

class UserAuditSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'user_name','location']