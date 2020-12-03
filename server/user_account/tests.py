from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from organization.models import Organization
from .models import CustomUser


class CustomUserTestCase(TestCase):
    # Having the fixtures loads the entries into the db for testing
    fixtures = ["users.json"]

    def test_user_creation(self):
        """ User was created correctly """
        CustomUser.objects.get(id=1)


class RegistrationTestCase(APITestCase):
    fixtures = ["users.json", "organizations.json"]

    def setUp(self):
        self.client = APIClient()
        self.url = "/user/"

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")

        self.inventory_manager = CustomUser.objects.get(user_name="im")
        organization = self.inventory_manager.organization

        # Create each type of user that could be registered
        self.registered_system_admin = {
            'user_name': 'registered_SA',
            'email': 'registered_SA@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'system_admin',
            'role': 'SA',
            'is_active': 'True',
            'location': '',
            'organization': organization.org_id}

        self.registered_system_admin_2 = {
            'user_name': 'registered_SA',
            'email': 'registered_SA@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'system_admin',
            'role': 'SA',
            'is_active': 'True',
            'location': '',
            'organization': ''}

        self.store_keeper = {
            'user_name': 'sk2',
            'email': 'sk2@email.com',
            'password': 'password',
            'first_name': 'stock2',
            'last_name': 'keeper2',
            'role': 'SK',
            'is_active': 'True',
            'location': '',
            'organization': organization.org_id
        }

    def test_registration_success_linked_to_organization(self):
        """ User was registered correctly along with its organization"""
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post(self.url, self.registered_system_admin)
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_success_not_linked_to_organization(self):
        """ User was registered correctly without an organization"""
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post(self.url, self.registered_system_admin_2)
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_failure_unauthorized_request(self):
        """ Non authenticated user cannot register another user"""
        # Not an authenticated user
        self.client.force_authenticate(user=None)
        request = self.client.post(self.url, self.registered_system_admin)
        self.assertEqual(request.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_registration_failure_method_not_allowed(self):
        """ User can't access the PUT method at this particular endpoint """
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.put(self.url)
        self.assertEqual(request.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)

    def test_registration_failure_missing_fields(self):
        """ Can't register user with missing fields """
        self.client.force_authenticate(user=self.system_admin)
        registered_missing_fields = {'user_name': 'missing_fields'}
        request = self.client.post(self.url, registered_missing_fields)
        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)

    def test_im_creates_sk(self):
        """ IM can create a stock keeper"""
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.post(self.url, self.store_keeper)
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)


class OpenRegistrationTestCase(APITestCase):

    def test_registration_success_linked_to_organization(self):
        """ User was registered correctly with its organization"""
        organization = Organization.objects.create(org_name="Test")
        data = {'user_name': 'test_case',
                'email': 'test3@email.com',
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                'location': '',
                "organization": organization.org_id}
        response = self.client.post("/open-registration/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_success_not_linked_to_organization(self):
        """ User was registered correctly without its organization"""
        data = {'user_name': 'test_case',
                'email': 'test2@email.com',
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "is_active": "True",
                'location': '',
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
    fixtures = ["users.json"]

    def test_login_invalid_user(self):
        """ User that does not exist in database """
        response = self.client.post(
            "/login/", {"email": "t@test.com", "password": "test"})
        self.assertEqual(response.status_code,
                         status.HTTP_500_INTERNAL_SERVER_ERROR)

    def test_login_wrong_credentials(self):
        """ User that has wrong credentials """
        response = self.client.post(
            "/login/", {"email": "sa2@test.com", "password": "test12"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_not_active(self):
        """ User that has a valid account but is not active """
        response = self.client.post(
            "/login/", {"email": "sa2@test.com", "password": "sa"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_success_without_existing_token(self):
        """ User can login successfully and doesn't have token in db"""
        response = self.client.post("/login/", {'email': 'sa@test.com', 'password': 'sa'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class LogoutTest(APITestCase):
    fixtures = ["users.json"]

    def setUp(self):
        user = CustomUser.objects.get(user_name="sa")

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


class UpdateProfileTest(APITestCase):
    fixtures = ["users.json"]

    # pylint: disable=too-many-instance-attributes
    def setUp(self):
        self.client = APIClient()
        self.url = "/user/"

        # Create each type of user that could be making the request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.manager = CustomUser.objects.get(user_name="im")
        self.stock_keeper = CustomUser.objects.get(user_name="sk")

        self.sys_admin_id = self.system_admin.id
        # self.test_user_id = self.test_user.id

    def test_update_another_user_information(self):
        """ User can't update the info of another user """
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(
            self.url + str(self.sys_admin_id) + "/", {"user_name": "sa"})
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_update_own_user_information(self):
        """ User can update his own info """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.patch(
            self.url + str(self.sys_admin_id) + "/", {"user_name": "sa"})
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)

    def test_im_update_sk_user_information(self):
        """ Inventory manager can update Stock Keeper's info"""
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(self.url + str(self.stock_keeper.id) +
                                     "/", {"email": "1@gmail.com"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class ChangePasswordTest(APITestCase):
    fixtures = ["users.json"]
    # pylint: disable=too-many-instance-attributes
    def setUp(self):
        self.client = APIClient()
        self.url = "/user/"

        self.s_a = CustomUser.objects.get(user_name="sa")
        self.i_m = CustomUser.objects.get(user_name="im")
        self.s_k = CustomUser.objects.get(user_name="sk")
        self.sa_id = self.s_a.id

    def test_update_another_user_password(self):
        """ User can't update the password of another user unless he is
         an admin or the same user """
        self.client.force_authenticate(user=self.i_m)
        response = self.client.put(
            self.url + str(self.sa_id) + "/", {"password": "12"})
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_update_own_user_password(self):
        """ User can update his own password """
        self.client.force_authenticate(user=self.s_a)
        response = self.client.put(
            self.url + str(self.sa_id) + "/", {"password": "123456"})
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)

    def test_im_update_sk_password(self):
        self.client.force_authenticate(user=self.i_m)
        response = self.client.put(
            self.url + str(self.s_k.id) + "/", {"password": "a"})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class RetreivePersonalInfoTest(APITestCase):
    fixtures = ["users.json"]

    def setUp(self):
        self.client = APIClient()
        self.url = "/user/"

        self.user = CustomUser.objects.get(user_name="sa")
        self.inventory = CustomUser.objects.get(user_name="im")
        self.us_id = self.user.id

    def test_update_another_user_password(self):
        """ User can't update the password of another user unless if he is an admin """
        self.client.force_authenticate(user=self.inventory)
        response = self.client.get(
            self.url + str(self.us_id) + "/")
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_update_own_user_password(self):
        """ User can update his own password """
        self.client.force_authenticate(user=self.user)
        response = self.client.get(
            self.url + str(self.us_id) + "/")
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
