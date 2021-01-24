from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from django.db.models import signals
import factory
from user_account.models import CustomUser
from .models import Organization


class OrganizationTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.create(
            user_name='system_admin1',
            email='system_admin1@email.com',
            password='password1',
            first_name='system1',
            last_name='admin1',
            role='SA',
            is_active=True)

        self.inventory_manager = CustomUser.objects.create(
            user_name='inventory_manager1',
            email='inventory_manager1@email.com',
            password='password1',
            first_name='inventory1',
            last_name='manage1r',
            role='IM',
            is_active=True)

    @factory.django.mute_signals(signals.pre_save, signals.post_save)
    def test_create_organization_sys_admin_success(self):
        """ Organization was created correctly """
        self.client.force_authenticate(user=self.system_admin)
        data = {'org_name': 'test_case'}
        response = self.client.post("/organization/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_organization_inventory_manager_success(self):
        """ Inventory manager is not allowed to create an organization """
        self.client.force_authenticate(user=self.inventory_manager)
        data = {'org_name': 'test_case'}
        response = self.client.post("/organization/", data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_organization_failure(self):
        """ User can't create organization if missing fields """
        self.client.force_authenticate(user=self.system_admin)
        data = {}
        response = self.client.post("/organization/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_organization_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.get("/organization/")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_organization_unauthorized_clearence(self):
        """ IM can create or delete an organization """
        self.client.force_authenticate(user=self.inventory_manager)
        response = self.client.delete("/organization/")
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_get_all_organization(self):
        """ IM can get a list of organization """
        self.client.force_authenticate(user=self.inventory_manager)
        response = self.client.get("/organization/")
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)


class InventoryItemRefreshTestCase(APITestCase):

    @factory.django.mute_signals(signals.pre_save, signals.post_save)
    def setUp(self):
        self.client = APIClient()

        self.organization = Organization.objects.create(org_name="Test")

        self.system_admin = CustomUser.objects.create(
            user_name='system_admin1',
            email='system_admin1@email.com',
            password='password1',
            first_name='system1',
            last_name='admin1',
            role='SA',
            is_active=True,
            organization=self.organization.org_id)

    def update_organization_inventory_item_refresh_time_success(self):
        """ Timing has been updated correctly """
        self.client.force_authenticate(user=self.system_admin)
        data = {"org_id": self.organization.org_id, "new_job_timing": "14"}
        response = self.client.post("/InventoryItemRefreshTime/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def update_organization_inventory_item_refresh_time_fail(self):
        """
        Timing can't be updated correctly for an
        organization that doesnt exist
        """
        self.client.force_authenticate(user=self.system_admin)
        data = {"org_id": "1234", "new_job_timing": "14"}
        response = self.client.post("/InventoryItemRefreshTime/", data)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
