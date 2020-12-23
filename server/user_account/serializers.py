from rest_framework import serializers
from django.core.exceptions import ObjectDoesNotExist
from .models import CustomUser, Organization


class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = []

    def save(self):
        can_save = True
        user = None
        for save_field in list(self.data.keys()):
            can_save = can_save and self.validated_data[save_field]
        if self.context:
            try:
                user = CustomUser.objects.get(pk=self.context)
            except ObjectDoesNotExist:
                user = None
        if can_save:
            if not user and 'user_name' in self.data:
                user = CustomUser()
            for save_field in self.data:
                if save_field == 'password':
                    user.set_password(self.data[save_field])
                elif save_field == 'organization':
                    setattr(user, save_field,
                            Organization.objects.get(org_id=self.data[save_field]))
                else:
                    setattr(user, save_field, self.data[save_field])
                user.save()
        return user
