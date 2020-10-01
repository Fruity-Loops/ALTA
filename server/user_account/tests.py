from django.test import TestCase

from .models import CustomUser


class CustomUserTestCase(TestCase):
    def setUp(self):
        CustomUser.objects.create(user_name="test_user", email="test@test.com", id=1, first_name='test',
                                  last_name='user', role='SA')

    def test_user_creation(self):
        """ User was created correctly """
        user = CustomUser.objects.get(id=1)
        self.assertEqual(user.user_name, "test_user")
        self.assertEqual(user.email, "test@test.com")
        self.assertEqual(user.first_name, "test")
        self.assertEqual(user.last_name, "user")
        self.assertEqual(user.role, "SA")