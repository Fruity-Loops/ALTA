from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class CustomUser(AbstractBaseUser):
    USERS = (
        ('SA', 'System Admin'),
        ('IM', 'Inventory Manager'),
        ('SK', 'Stock Keeper'),
    )
    user_name = models.CharField(max_length=30, unique=True)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    role = models.CharField(max_length=2, choices=USERS)
    is_active = models.BooleanField(default=True)
    email = models.EmailField(verbose_name='email', max_length=255, unique=True)
    # no need to specify password because its build in

    USERNAME_FIELD = 'user_name'
    REQUIRED_FIELDS = ['email', 'first_name', 'last_name', 'role']

    @property
    def get_role(self):
        return self.role

    # Create token for user who just registered
    @receiver(post_save, sender=settings.AUTH_USER_MODEL)
    def create_auth_token(sender, instance=None, created=False, **kwargs):
        if created:
            Token.objects.create(user=instance)
