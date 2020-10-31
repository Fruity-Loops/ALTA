from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from organization.models import Organization
from .models import CustomUser


class CustomUserTestCase(TestCase):

    def setUp(self):
        organization = Organization.objects.create(org_name="Test")
        CustomUser.objects.create(user_name="test_user",
                                  email="test@test.com",
                                  id=1,
                                  first_name='test',
                                  last_name='user',
                                  role='SA',
                                  organization=organization)

    def test_user_creation(self):
        """ User was created correctly """
        user = CustomUser.objects.get(id=1)
        self.assertEqual(user.user_name, "test_user")
        self.assertEqual(user.email, "test@test.com")
        self.assertEqual(user.first_name, "test")
        self.assertEqual(user.last_name, "user")
        self.assertEqual(user.role, "SA")

    def test_get_role(self):
        user = CustomUser.objects.get(id=1)
        self.assertEqual(user.get_role, "SA")


class AccessAllClientsTestCase(TestCase):
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

        CustomUser.objects.create(
            user_name='inventory_manager',
            email='inventory_manager@email.com',
            password='password',
            first_name='inventory',
            last_name='manager',
            role='IM',
            is_active=True)

        # Create each type of user that could be registered
        self.registered_system_admin = {
            'user_name': 'system_admin',
            'email': 'system_admin@email.com',
            'password': 'password',
            'first_name': 'system',
            'last_name': 'admin',
            'role': 'SA',
            'is_active': True}

        self.registered_inventory_manager = {
            'user_name': 'inventory_manager',
            'email': 'inventory_manager@email.com',
            'password': 'password',
            'first_name': 'inventory',
            'last_name': 'manager',
            'role': 'IM',
            'is_active': True}

    def test_obtain_all_clients(self):
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.get("/getAllClients/", self.registered_system_admin)
        # self.assertEqual(request.status_code, status.HTTP_201_CREATED)
        data = request.data
        self.assertEqual(data[0]['first_name'], self.registered_system_admin['first_name'])
        self.assertEqual(data[0]['last_name'], self.registered_system_admin['last_name'])
        self.assertEqual(data[0]['role'], self.registered_system_admin['role'])
        self.assertEqual(data[0]['is_active'], self.registered_system_admin['is_active'])
        self.assertEqual(data[1]['first_name'], self.registered_inventory_manager['first_name'])
        self.assertEqual(data[1]['last_name'], self.registered_inventory_manager['last_name'])
        self.assertEqual(data[1]['role'], self.registered_inventory_manager['role'])
        self.assertEqual(data[1]['is_active'], self.registered_inventory_manager['is_active'])


class RegistrationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        organization = Organization.objects.create(org_name="Test")
        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.create(
            user_name='system_admin',
            email='system_admin@email.com',
            password='password',
            first_name='system',
            last_name='admin',
            role='SA',
            is_active=True,
            organization=organization)

        # Create each type of user that could be registered
        self.registered_system_admin = {
            'user_name': 'registered_SA',
            'email': 'registered_SA@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'system_admin',
            'role': 'SA',
            'is_active': 'True',
            'organization': organization.org_id}

        self.registered_system_admin_2 = {
            'user_name': 'registered_SA',
            'email': 'registered_SA@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'system_admin',
            'role': 'SA',
            'is_active': 'True',
            'organization': ''}

    def test_registration_success_linked_to_organization(self):
        """ User was registered correctly along with its organization"""
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post("/registration/", self.registered_system_admin)
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_success_not_linked_to_organization(self):
        """ User was registered correctly without an organization"""
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post("/registration/", self.registered_system_admin_2)
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_failure_unauthorized_request(self):
        """ Non authenticated user cannot register another user"""
        # Not an authenticated user
        self.client.force_authenticate(user=None)
        request = self.client.post("/registration/", self.registered_system_admin)
        self.assertEqual(request.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_registration_failure_method_not_allowed(self):
        """ User can't access the PUT method at this particular endpoint """
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.put("/registration/")
        self.assertEqual(request.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_registration_failure_missing_fields(self):
        """ Can't register user with missing fields """
        self.client.force_authenticate(user=self.system_admin)
        registered_missing_fields = {'user_name': 'missing_fields'}
        request = self.client.post("/registration/", registered_missing_fields)
        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)


class OpenRegistrationTestCase(APITestCase):

    def test_registration_success_linked_to_organization(self):
        """ User was registered correctly with its organization"""
        organization = Organization.objects.create(org_name="Test")
        data = {'user_name': 'test_case',
                'email': 'test@email.com',
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                "organization": organization.org_id}
        response = self.client.post("/open-registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_success_not_linked_to_organization(self):
        """ User was registered correctly without its organization"""
        data = {'user_name': 'test_case',
                'email': 'test@email.com',
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                "organization": ""}
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
            "/login/", {"user_name": "test_user", "password": "test12"})
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

    def test_login_success_with_existing_token(self):
        """ User can login successfully and has a token already in db"""
        user = CustomUser(user_name="test_user2",
                          email="test2@test.com",
                          id=2,
                          first_name='test',
                          last_name='user',
                          role='SA',
                          is_active=True)
        user.set_password("12")
        user.save()

        response = self.client.post("/login/", {'user_name': 'test_user2', 'password': '12'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_success_without_existing_token(self):
        """ User can login successfully and doesn't have token in db"""
        user = CustomUser(user_name="test_user2",
                          email="test2@test.com",
                          id=2,
                          first_name='test',
                          last_name='user',
                          role='SA',
                          is_active=True)
        user.set_password("12")
        user.save()

        response = self.client.post("/login/", {'user_name': 'test_user2', 'password': '12'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_login_success_user_linked_to_organization(self):
        """ User can login successfully and is linked to an organization"""
        organization = Organization.objects.create(org_name="Test")
        user = CustomUser(user_name="test",
                          email="tes@test.com",
                          id=3,
                          first_name='test',
                          last_name='user',
                          role='SA',
                          is_active=True,
                          organization=organization)
        user.set_password("12")
        user.save()

        response = self.client.post("/login/", {'user_name': 'test', 'password': '12'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


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


class SearchClientsTest(APITestCase):
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

    def test_search_clients(self):
        """ Search clients by firstname """
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        data = {
            'name': 'system'
        }
        response = self.client.post("/getSomeClients/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UpdateProfileTest(APITestCase):

    def setUp(self):
        self.client = APIClient()

        organization = Organization.objects.create(org_name="Test")
        # Create each type of user that could be making the request
        self.system_admin = CustomUser.objects.create(
            user_name='system_admin',
            email='system_admin@email.com',
            password='password',
            first_name='system',
            last_name='admin',
            role='SA',
            is_active=True,
            organization=organization)

        self.test_user = CustomUser.objects.create(
            user_name='test',
            email='test@email.com',
            password='password',
            first_name='system',
            last_name='admin',
            role='SA',
            is_active=True,
            organization=organization)

        self.sys_admin_id = self.system_admin.id
        self.test_user_id = self.test_user.id

    def test_update_another_user_information(self):
        """ User can't update the info of another user """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.patch(
            "/updateProfile/" + str(self.test_user_id) + "/", {"user_name": "test_us"})
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_update_own_user_information(self):
        """ User can update his own info """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.patch(
            "/updateProfile/" + str(self.sys_admin_id) + "/", {"user_name": "test_us"})
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
