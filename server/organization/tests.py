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

        # Create each type of user
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
            last_name='manager1',
            role='IM',
            is_active=True)

        self.stock_keeper = CustomUser.objects.create(
            user_name='stock_keeper1',
            email='stock_keeper1@email.com',
            password='password1',
            first_name='inventory1',
            last_name='keeper1',
            role='SK',
            is_active=True)

    @factory.django.mute_signals(signals.pre_save, signals.post_save)
    def test_create_organization_sys_admin_success(self):
        """ Organization was created correctly """
        self.client.force_authenticate(user=self.system_admin)
        data = {'org_name': 'test_case', 'address': ['Florida']}
        response = self.client.post("/organization/", data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_organization_inventory_manager_success(self):
        """ Inventory manager and Stock Keeper is not allowed to create an organization """
        self.client.force_authenticate(user=self.inventory_manager)
        data = {'org_name': 'test_case'}
        request = self.client.post("/organization/", data)
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.stock_keeper)
        new_request = self.client.post("/organization/", data)
        self.assertEqual(new_request.status_code, status.HTTP_403_FORBIDDEN)

    def test_create_organization_failure(self):
        """ User can't create organization if missing fields """
        self.client.force_authenticate(user=self.system_admin)
        data = {}
        request = self.client.post("/organization/", data, format='json')
        self.assertEqual(request.status_code, status.HTTP_400_BAD_REQUEST)

    def test_organization_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        request = self.client.get("/organization/")
        self.assertEqual(request.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_organization_unauthorized_clearence(self):
        """ IM and SK can't delete an organization """
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.delete("/organization/")
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.stock_keeper)
        new_request = self.client.delete("/organization/")
        self.assertEqual(new_request.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_all_organization(self):
        """ IM can't get a list of organization """
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.get("/organization/")
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthorized_get_all_organization(self):
        """ SK can't get a list of organization """
        self.client.force_authenticate(user=self.stock_keeper)
        request = self.client.get("/organization/")
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)


class InventoryItemRefreshTestCase(APITestCase):
    fixtures = ["users.json", "organizations.json"]

    @factory.django.mute_signals(signals.pre_save, signals.post_save)
    def setUp(self):
        self.client = APIClient()
        self.organization = Organization.objects.get(pk=1).org_id
        self.system_admin = CustomUser.objects.get(pk=1)
        self.inventory_manager = CustomUser.objects.get(pk=2)
        self.stock_keeper = CustomUser.objects.get(pk=3)

    def test_org_inventory_item_refresh_time_sa(self):
        """ Timing has been updated correctly """
        self.client.force_authenticate(user=self.system_admin)
        data = {'time': ['60'], 'new_job_interval': ['minutes'], 'ftp_location': ['ftp://host/inventory'], 'organization_id': ['1'], 'file': ['dummy_data.xlsx']}
        response = self.client.post("/InventoryItemRefreshTime/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_org_inventory_item_refresh_time_im(self):
        """ Timing has been updated correctly """
        self.client.force_authenticate(user=self.inventory_manager)
        data = {'time': ['60'], 'new_job_interval': ['minutes'], 'ftp_location': ['ftp://host/inventory'], 'organization_id': ['1'], 'file': ['dummy_data.xlsx']}
        response = self.client.post("/InventoryItemRefreshTime/", data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_org_inventory_item_refresh_time_sk(self):
        """ Timing shall not be updated by SK """
        self.client.force_authenticate(user=self.stock_keeper)
        data = {"organization": self.organization, "new_job_timing": "14"}
        request = self.client.post("/InventoryItemRefreshTime/", data, format='json')
        self.assertEqual(request.status_code, status.HTTP_403_FORBIDDEN)

    def test_org_item_refresh_time_fail(self):
        """
        Timing can't be updated correctly for an
        organization that doesnt exist
        """
        self.client.force_authenticate(user=self.system_admin)
        data = {"organization_id": "1234", "time": "14"}
        response = self.client.post("/InventoryItemRefreshTime/", data)
        self.assertEqual(response.status_code, status.HTTP_500_INTERNAL_SERVER_ERROR)
