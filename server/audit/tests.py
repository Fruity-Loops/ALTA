from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from organization.models import Organization
from user_account.models import CustomUser
from inventory_item.models import Item
from .models import Audit


class AuditTestCase(APITestCase):

    fixtures = ["items.json", "users.json", "organizations.json", "audits.json"]

    def setUp(self):
        self.client = APIClient()
        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.org_id = Organization.objects.get(org_id="1")
        self.inv_manager = CustomUser.objects.get(user_name="im")
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

    def test_create_audit_as_sa(self):
        """ Create audit as system admin"""
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id]})
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)
        self.assertEqual(response.data['inventory_items'][0], self.item_one._id)
        self.assertEqual(response.data['inventory_items'][1], self.item_two._id)

    def test_create_audit_as_im_bad_org(self):
        """ Try to create audit as inventory manager from another organization"""
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id],
                                     "org": 3})
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_create_audit_as_im(self):
        """ Create audit as inventory manager """
        self.client.force_authenticate(user=self.inv_manager)

        # create initial audit with inventory items
        response1 = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id],
                                     "org": self.org_id.org_id})
        self.assertEqual(response1.status_code,
                         status.HTTP_201_CREATED)

        self.assertEqual(response1.data['inventory_items'][0], self.item_one._id)
        self.assertEqual(response1.data['inventory_items'][1], self.item_two._id)
        self.assertEqual(response1.data['org'], self.org_id.org_id)

        print(response1.data['audit_id'])
        # update audit with selected stock-keepers
        response2 = self.client.patch("/audit/response1.data['audit_id']",
                                     {"inventory_items": [self.item_one._id, self.item_two._id],
                                      "org": self.org_id.org_id})
        self.assertEqual(response2.status_code,
                         status.HTTP_201_CREATED)
        self.assertEqual(response2.data['inventory_items'][0], self.item_one._id)
        self.assertEqual(response2.data['inventory_items'][1], self.item_two._id)

