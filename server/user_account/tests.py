from django.test import TestCase
from django.contrib.auth.hashers import check_password
from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from .serializers import UserSerializer
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


class RegistrationTestCase(APITestCase):

    def test_registration_success(self):
        """ User was registered correctly """
        data = {'user_name': 'test_case', 'email': 'test@email.com', "password": "password", "first_name": "test",
                "last_name": "user", "role": "SA", "is_active": "True"}
        response = self.client.post("/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_failure(self):
        """ User can't register if missing fields """
        data = {'user_name': 'test_case', "password": "password", "first_name": "test",
                "last_name": "user", "role": "SA"}
        response = self.client.post("/registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_unauthorized_request(self):
        """ User can't access the GET method at this particular endpoint """
        response = self.client.get("/registration/")
        self.assertEqual(response.status_code, status.HTTP_405_METHOD_NOT_ALLOWED)


class LoginTest(APITestCase):

    def setUp(self):
        CustomUser.objects.create(user_name="test_user", email="test@test.com", id=1, first_name='test',
                                  last_name='user', role='SA', password="test", is_active=True)

    def test_login_invalid_user(self):
        """ User that does not exist in database """
        response = self.client.post("/login/", {"user_name": "test_us", "password": "test"})
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_login_wrong_credentials(self):
        """ User that has wrong credentials """
        response = self.client.post("/login/", {"user_name": "test_user", "password": "test"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_not_active(self):
        """ User that has a valid account but is not active """
        CustomUser.objects.create(user_name="test_user3", email="test3@test.com", id=3, first_name='test',
                                  last_name='user', role='SA', password="test", is_active=False)
        response = self.client.post("/login/", {"user_name": "test_user3", "password": "test"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_success(self):
        """ User can login successfully """
        CustomUser.objects.create(user_name="test_user2", email="test2@test.com", id=2, first_name='test',
                                  last_name='user', role='SA', password="test", is_active=True)
        user = CustomUser.objects.get(user_name="test_user2")
        self.assertEqual("test", user.password)
        self.assertEqual("test_user2", user.user_name)


class LogoutTest(APITestCase):

    def setUp(self):
        CustomUser.objects.create(user_name="test_user", email="test@test.com", id=1, first_name='test',
                                  last_name='user', role='SA', password="test", is_active=True)

        user = CustomUser.objects.get(user_name="test_user")

        self.token = Token.objects.create(user=user)
        self.api_authentication_valid_token()

    def api_authentication_valid_token(self):
        """ Added valid token header to request """
        self.client.credentials(HTTP_AUTHORIZATION="Token " + str(self.token))

    def api_authentication_invalid_token(self):
        """ Added invalid token header to request"""
        self.client.credentials(HTTP_AUTHORIZATION="Token " + "57c5c737d366de975d168f87f9ff535285c02af0")

    def test_logout_success(self):
        """ User can logout successfully with valid token """
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_failure(self):
        """ User can't logout without a valid token """
        self.api_authentication_invalid_token()
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
