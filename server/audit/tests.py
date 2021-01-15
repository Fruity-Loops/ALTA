from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from organization.models import Organization
from user_account.models import CustomUser
from inventory_item.models import Item
from .models import Audit


class AuditTestCase(APITestCase):

    fixtures = ["items.json", "users.json", "organizations.json"]

    def setUp(self):
        self.client = APIClient()
        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.item_one = Item.objects.get(_id=12731369.0)
        self.item_two = Item.objects.get(_id=12752842.0)
        self.audit = Audit.objects.create()
        self.audit.inventory_items.add(self.item_one._id, self.item_two._id)

    def test_audit_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id]})
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_create_audit(self):
        """ Create audit """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id]})
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)
        self.assertEqual(response.data['inventory_items'][0], self.item_one._id)
        self.assertEqual(response.data['inventory_items'][1], self.item_two._id)
