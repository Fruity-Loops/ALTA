import json
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
import factory
from django.db.models import signals
from django.test import TestCase
from organization.models import Organization
from .models import CustomUser


class CustomUserTestCase(TestCase):
    # Having the fixtures loads the entries into the db for testing
    fixtures = ["users.json"]

    def test_user_creation(self):
        """ User was created correctly """
        CustomUser.objects.get(id=1)


class RegistrationTestCase(APITestCase):
    # pylint: disable=too-many-instance-attributes
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
            'organization': organization.org_id,
            'location': ''}

        self.registered_system_admin_2 = {
            'user_name': 'registered_SA',
            'email': 'registered_SA@email.com',
            'password': 'password',
            'first_name': 'registered',
            'last_name': 'system_admin',
            'role': 'SA',
            'is_active': 'True'}

        self.store_keeper = {
            'user_name': 'sk2',
            'email': 'sk2@email.com',
            'password': 'password',
            'first_name': 'stock2',
            'last_name': 'keeper2',
            'role': 'SK',
            'is_active': 'True',
            'organization': organization.org_id,
            'location': ''}

        self.im2 = {
            'user_name': 'im2',
            'email': 'im2@email.com',
            'password': 'password',
            'first_name': 'inventory2',
            'last_name': 'manager2',
            'role': 'IM',
            'is_active': 'True',
            'organization': organization.org_id,
            'location': ''}

    def test_registration_success_linked_to_organization(self):
        """ User was registered correctly along with its organization"""
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post(self.url, self.registered_system_admin,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_success_not_linked_to_organization(self):
        """ User was registered correctly without an organization"""
        # Authenticate a system admin
        self.client.force_authenticate(user=self.system_admin)
        request = self.client.post(self.url, self.registered_system_admin_2,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_registration_failure_unauthorized_request(self):
        """ Non authenticated user cannot register another user"""
        # Not an authenticated user
        self.client.force_authenticate(user=None)
        request = self.client.post(self.url, self.registered_system_admin,
                                   format='json')
        self.assertEqual(request.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_registration_failure_missing_fields(self):
        """ Can't register user with missing fields """
        self.client.force_authenticate(user=self.system_admin)
        registered_missing_fields = {'user_name': 'missing_fields', "location": ""}
        request = self.client.post(self.url, registered_missing_fields,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)

    def test_im_creates_sk(self):
        """ IM can create a stock keeper"""
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.post(self.url, self.store_keeper,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_im_creates_im(self):
        """ IM can create an IM"""
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.post(self.url, self.im2,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

    def test_im_creates_sa(self):
        """ IM can't create an SA"""
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.post(self.url, self.registered_system_admin_2,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)

    def test_im_creates_sk_diff_org(self):
        """ IM can't create a stock keeper in a different organization"""
        self.client.force_authenticate(user=self.inventory_manager)
        self.store_keeper["organization"] = ""
        request = self.client.post(self.url, self.store_keeper,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)

    def test_im_creates_im_diff_org(self):
        """ IM can't create an inventory manager in a different organization"""
        self.client.force_authenticate(user=self.inventory_manager)
        self.im2["organization"] = ""
        request = self.client.post(self.url, self.im2,
                                   format='json')
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)


class OpenRegistrationTestCase(APITestCase):

    @factory.django.mute_signals(signals.pre_save, signals.post_save)
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
                "location": "",
                "organization": organization.org_id}
        response = self.client.post("/open-registration/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_success_not_linked_to_organization(self):
        """ User was registered correctly without its organization"""
        data = {'user_name': 'test_case',
                'email': 'test2@email.com',
                "password": "password",
                "first_name": "test",
                "last_name": "user",
                "role": "SA",
                "location": "",
                "organization": "",
                "is_active": "True"}
        response = self.client.post("/open-registration/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_registration_failure(self):
        """ User can't register if missing fields """
        data = {'user_name': 'test_case', "password": "password", "first_name": "test",
                "last_name": "user", "role": "SA", "location": ""}
        response = self.client.post("/open-registration/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_registration_unauthorized_request(self):
        """ User can't access the GET method at this particular endpoint """
        response = self.client.get("/open-registration/")
        self.assertEqual(response.status_code,
                         status.HTTP_405_METHOD_NOT_ALLOWED)


class UpdateProfileTest(APITestCase):
    fixtures = ["users.json", "organizations"]

    # pylint: disable=too-many-instance-attributes
    def setUp(self):
        self.client = APIClient()
        self.url = "/user/"

        # Create each type of user that could be making the request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.manager = CustomUser.objects.get(user_name="im")
        self.stock_keeper = CustomUser.objects.get(user_name="sk")

        self.sys_admin_id = self.system_admin.id
        self.save_email = {"email": "1@test.com"}

    def test_update_another_user_information(self):
        """ User can't update the info of another user """
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(
            self.url + str(self.sys_admin_id) + "/",
            {"user_name": "random"}, format='json')
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_im_update_sk_user_information(self):
        """ Inventory manager can update Stock Keeper's info"""
        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(self.url + str(self.stock_keeper.id) +
                                     "/", {"user_name": "aaa"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_own_user_information(self):
        """ Users can update their own regular info """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.patch(self.url + str(self.sys_admin_id) + "/",
                                     {"user_name": "random"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(
            self.url + str(self.manager.id) + "/",
            {"user_name": "random1"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_own_user_role(self):
        """ Users shouldn't be able to update their own roles """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.patch(
            self.url + str(self.sys_admin_id) + "/",
            {"role": "IM"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response = self.client.get(self.url + str(self.sys_admin_id) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'SA')

        self.client.force_authenticate(user=self.manager)
        response = self.client.patch(
            self.url + str(self.manager.id) + "/",
            {"role": "SA"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        response = self.client.get(self.url + str(self.manager.id) + "/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['role'], 'IM')


class ChangePasswordTest(APITestCase):
    fixtures = ["users.json", "organizations"]
    # pylint: disable=too-many-instance-attributes
    def setUp(self):
        self.client = APIClient()
        self.url = "/user/"

        self.s_a = CustomUser.objects.get(user_name="sa")
        self.i_m = CustomUser.objects.get(user_name="im")
        self.s_k = CustomUser.objects.get(user_name="sk")
        self.sa_id = self.s_a.id
        self.save_fields = {"password": "123456"}

    def test_update_another_user_password(self):
        """ User can't update the password of another user unless he is
         an admin or the same user """
        self.client.force_authenticate(user=self.i_m)
        response = self.client.patch(
            self.url + str(self.sa_id) + "/", self.save_fields)
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_update_own_user_password(self):
        """ Users can update their own password """
        self.client.force_authenticate(user=self.s_a)
        response = self.client.patch(
            self.url + str(self.sa_id) + "/", self.save_fields, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        self.client.force_authenticate(user=self.i_m)
        response = self.client.patch(
            self.url + str(self.i_m.id) + "/", self.save_fields, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_im_update_sk_password(self):
        self.client.force_authenticate(user=self.i_m)
        response = self.client.patch(
            self.url + str(self.s_k.id) + "/", self.save_fields)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class RetreivePersonalInfoTest(APITestCase):
    fixtures = ["users.json", "organizations"]

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
