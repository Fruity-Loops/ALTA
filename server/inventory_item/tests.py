from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from user_account.models import CustomUser


class ItemTestCase(APITestCase):

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

    def test_organization_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.get("/item/")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_get_all_organization(self):
        """ SA can get a list of items """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.get("/item/")
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)
