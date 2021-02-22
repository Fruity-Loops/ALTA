from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from user_account.models import CustomUser
from inventory_item.models import Item


class ItemTestCase(APITestCase):
    fixtures =["items.json", "users.json"]

    def setUp(self):
        self.client = APIClient()

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")

        self.item_one = Item.objects.get(Batch_Number="12731369")

        self.item_two = Item.objects.get(Batch_Number="12752842")

    def test_organization_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.get("/item/")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_get_all_inventory_items(self):
        """ Obtaining all items """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.get("/item/?organization=3")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data['results'][0]['Part_Number'], self.item_one.Part_Number)
        self.assertEqual(response.data['results'][1]['Part_Number'], self.item_two.Part_Number)

    def test_get_one_item(self):
        """ Obtains the first item """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.get("/item/?organization=3&page=1&page_size=1")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'][0]['Part_Number'], self.item_one.Part_Number)

    def test_get_search_items(self):
        """ Obtaining searched items """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.get("/item/?organization=3&page=1&page_size=25&search=YYC")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data['results'][0]['Location'], 'YYC')

