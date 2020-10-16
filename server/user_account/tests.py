import json
from django.test import TestCase
from django.test.client import Client as HttpClient
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from .models import CustomUser


class CustomUserTestCase(TestCase):

    def setUp(self):
        CustomUser.objects.create(user_name="test_user",
                                  email="test@test.com",
                                  id=1,
                                  first_name='test',
                                  last_name='user',
                                  role='SA')

    def test_user_creation(self):
        """ User was created correctly """
        user = CustomUser.objects.get(id=1)
        self.assertEqual(user.user_name, "test_user")
        self.assertEqual(user.email, "test@test.com")
        self.assertEqual(user.first_name, "test")
        self.assertEqual(user.last_name, "user")
        self.assertEqual(user.role, "SA")


class AccessAllClientsTestCase(TestCase):

    @classmethod
    def setUpTestData(cls):
        cls.host = "http://localhost"  # or ip
        cls.port = 8001

        CustomUser.objects.create(user_name="test_user",
                                  email="test@test.com",
                                  id=9999,
                                  first_name='test',
                                  last_name='user',
                                  role='SA',
                                  is_active=True)
        CustomUser.objects.create(user_name="test_user2",
                                  email="test2@test.com",
                                  id=9998,
                                  first_name='test',
                                  last_name='user',
                                  role='SA',
                                  is_active=True)

    def test_user_is_obtainable(self):
        url = self.host + str(self.port) + '/getAllClients/'
        client = HttpClient()
        response = client.get(url)
        data = json.loads(response.json())
        user = CustomUser.objects.get(user_name="test_user")
        self.assertEqual(data[0]['user_name'], user.user_name)
        self.assertEqual(data[0]['email'], user.email)
        self.assertEqual(data[0]['first_name'], user.first_name)
        self.assertEqual(data[0]['last_name'], user.last_name)
        self.assertEqual(data[0]['role'], user.role)
        user2 = CustomUser.objects.get(user_name="test_user2")
        self.assertEqual(data[1]['user_name'], user2.user_name)
        self.assertEqual(data[1]['email'], user2.email)
        self.assertEqual(data[1]['first_name'], user2.first_name)
        self.assertEqual(data[1]['last_name'], user2.last_name)
        self.assertEqual(data[1]['role'], user2.role)

class RegistrationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.create(
            user_name='system_admin',
            email='system_admin@email.com',
            password='password',
            first_name='system',
            last_name='admin',
            role='SA',
            is_active=True)

        self.inventory_manager = CustomUser.objects.create(
            user_name='inventory_manager',
            email='inventory_manager@email.com',
            password='password',
            first_name='inventory',
            last_name='manager',
            role='IM',
            is_active=True)

        self.stock_keeper = CustomUser.objects.create(
            user_name='stock_keeper',
            email='stock_keeper@email.com',
            password='password',
            first_name='stock',
            last_name='keeper',
            role='SK',
            is_active=True)

        # Create each type of user that could be registered
        self.registered_system_admin = {
            'user_name': 'registered_SA',
            'email': 'registered_SA@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'system_admin',
            'role': 'SA',
            'is_active': 'True'}

        self.registered_inventory_manager = {
            'user_name': 'registered_IM',
            'email': 'registered_IM@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'inventory_manager',
            'role': 'IM',
            'is_active': 'True'}

        self.registered_stock_keepeer = {
            'user_name': 'registered_SK',
            'email': 'registered_SK@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'stock_keepeer',
            'role': 'SK',
            'is_active': 'True'}

    def test_registration_success(self):
        """ User was registered correctly """
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post("/registration/", self.registered_system_admin)
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_failure_unauthorized_request(self):
        """ Non authenticated user cannot register another user"""
        # Not an authenticated user
        self.client.force_authenticate(user=None)
        request = self.client.post("/registration/", self.registered_system_admin)
        self.assertEqual(request.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_registration_failure_method_not_allowed(self):
        """ User can't access the GET method at this particular endpoint """
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.get("/registration/")
        self.assertEqual(request.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_registration_failure_missing_fields(self):
        """ Can't register user with missing fields """
        self.client.force_authenticate(user=self.system_admin)
        registered_missing_fields = {'user_name': 'missing_fields'}
        request = self.client.post("/registration/", registered_missing_fields)
        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)


class OpenRegistrationTestCase(APITestCase):

    def test_registration_success(self):
        """ User was registered correctly """
        data = {'user_name': 'test_case',
                'email': 'test@email.com',
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True"}
        response = self.client.post("/open-registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_failure(self):
        """ User can't register if missing fields """
        data = {'user_name': 'test_case', "password": "password", "first_name": "test",
                "last_name": "user", "role": "SA"}
        response = self.client.post("/open-registration/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_unauthorized_request(self):
        """ User can't access the GET method at this particular endpoint """
        response = self.client.get("/open-registration/")
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

class LoginTest(APITestCase):

    def setUp(self):
        CustomUser.objects.create(user_name="test_user",
                                  email="test@test.com",
                                  id=1,
                                  first_name='test',
                                  last_name='user',
                                  role='SA', password="test",
                                  is_active=True)

    def test_login_invalid_user(self):
        """ User that does not exist in database """
        response = self.client.post(
            "/login/", {"user_name": "test_us", "password": "test"})
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_login_wrong_credentials(self):
        """ User that has wrong credentials """
        response = self.client.post(
            "/login/", {"user_name": "test_user", "password": "test"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_not_active(self):
        """ User that has a valid account but is not active """
        CustomUser.objects.create(user_name="test_user3",
                                  email="test3@test.com",
                                  id=3,
                                  first_name='test',
                                  last_name='user',
                                  role='SA',
                                  password="test",
                                  is_active=False)
        response = self.client.post(
            "/login/", {"user_name": "test_user3", "password": "test"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_success(self):
        """ User can login successfully """
        CustomUser.objects.create(user_name="test_user2",
                                  email="test2@test.com",
                                  id=2,
                                  first_name='test',
                                  last_name='user',
                                  role='SA',
                                  password="test",
                                  is_active=True)

        user = CustomUser.objects.get(user_name="test_user2")
        self.assertEqual("test", user.password)
        self.assertEqual("test_user2", user.user_name)


class LogoutTest(APITestCase):
    def setUp(self):
        CustomUser.objects.create(user_name="test_user",
                                  email="test@test.com",
                                  id=1,
                                  first_name='test',
                                  last_name='user',
                                  role='SA',
                                  password="test",
                                  is_active=True)

        user = CustomUser.objects.get(user_name="test_user")

        self.token = Token.objects.create(user=user)
        self.api_authentication_valid_token()

    def api_authentication_valid_token(self):
        """ Added valid token header to request """
        # pylint: disable=no-member
        self.client.credentials(HTTP_AUTHORIZATION="Token " + str(self.token))

    def api_authentication_invalid_token(self):
        """ Added invalid token header to request"""
        # pylint: disable=no-member
        self.client.credentials(
            HTTP_AUTHORIZATION="Token " + "57c5c737d366de975d168f87f9ff535285c02af0")

    def test_logout_success(self):
        """ User can logout successfully with valid token """
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_failure(self):
        """ User can't logout without a valid token """
        self.api_authentication_invalid_token()
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
