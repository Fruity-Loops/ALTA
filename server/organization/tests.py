import json
from django.test import TestCase
from django.test.client import Client as HttpClient
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from user_account.models import CustomUser


class OrganizationTestCase(APITestCase):

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

    def test_create_organization_sys_admin_success(self):
        """ Organization was created correctly """
        self.client.force_authenticate(user=self.system_admin)
        data = {'org_name': 'test_case'}
        response = self.client.post("/organization/", data)
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
        response = self.client.post("/organization/", data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_organization_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.get("/organization/")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)
