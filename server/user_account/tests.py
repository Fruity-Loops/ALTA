from django.test import TestCase

from django.contrib.auth.models import User

class AuthUserTestCase(TestCase):
    def setUp(self):
        User.objects.create(username="test_user", email="test@test.com", id=1)

    def test_user_creation(self):
        """ User was created correctly """
        user = User.objects.get(id=1)
        self.assertEqual(user.username,"test_user")
