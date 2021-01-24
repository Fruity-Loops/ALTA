from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from organization.models import Organization
from user_account.models import CustomUser
from inventory_item.models import Item
from .models import Audit
from django.forms.models import model_to_dict
import json


class AuditTestCase(APITestCase):

    fixtures = ["items.json", "users.json", "organizations.json", "audits.json"]

    def setUp(self):
        self.client = APIClient()

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.inv_manager = CustomUser.objects.get(user_name="im")
        self.stock_keeper = CustomUser.objects.get(user_name="sk")

        # Create the affiliated organization
        self.org_id = Organization.objects.get(org_id="1")

        # Create audit components
        self.item_one = Item.objects.get(_id=12731369.0)
        self.item_two = Item.objects.get(_id=12752842.0)
        self.audit = Audit.objects.create()
        self.audit.inventory_items.add(self.item_one._id, self.item_two._id) #check if this was there before

    def test_audit_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id]},
                                    format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_create_audit_as_sa(self):
        """ Create audit as system admin """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id],
                                     "organization": 1}, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)
        print(self.item_one._id)
        self.assertEqual(response.data['inventory_items'][0], self.item_one._id)
        self.assertEqual(response.data['inventory_items'][1], self.item_two._id)
        self.assertEqual(response.data['organization'], 1)

    def test_create_audit_as_im_bad_org(self):
        """ Try to create audit as inventory manager from another organization """
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id],
                                     "organization": 3}, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_create_audit_as_im(self):
        """ Create audit as inventory manager from their organization """
        self.client.force_authenticate(user=self.inv_manager)

        # create initial audit with inventory items
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one._id, self.item_two._id],
                                     "organization": self.inv_manager.organization.org_id},
                                    format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)

        self.assertEqual(response.data['inventory_items'][0], self.item_one._id)
        self.assertEqual(response.data['inventory_items'][1], self.item_two._id)
        self.assertEqual(response.data['organization'], self.org_id.org_id)

    def test_update_audit_with_sks(self):
        """ Update an audit as inventory manager to assign stock-keepers """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(organization_id=1)

        response = self.client.patch('/audit/'f'{self.predefined_audit.audit_id}/',
                                     {"assigned_sk": [self.stock_keeper.id]}, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)

        # self.assertEqual(response.data['organization'], self.org_id.org_id)
        self.assertEqual(response.data['assigned_sk'][0], self.stock_keeper.id)

    def test_update_audit_with_im_bad_org(self):
        """ Try to access an audit as inventory manager from other organization """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(organization_id=3)

        response = self.client.get('/audit/'f'{self.predefined_audit.audit_id}/')

        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_item_to_sk_designation(self):
        """ Create ItemToSK designation as inventory manager """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(organization_id=1)

        response = self.client.post("/item-to-sk/",
                                    {"init_audit": 1,
                                     "customuser": 5,
                                     "item_ids": [12752842],
                                     "bins": ['A10']}, format="json")

        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)

        self.assertEqual(response.data['success'], "success")

    def test_item_to_sk_designation_bad_org(self):
        """ Try to create ItemToSK designation as inventory manager from another organization """

        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(organization_id=3)

        response = self.client.post("/item-to-sk/",
                                    {"init_audit": self.predefined_audit.audit_id,
                                     "customuser": 6,
                                     "item_ids": [12752842],
                                     "bins": ['A10']}, format="json")

        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def amanda_list(self):
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.get('/audit/', {'organization': 1, 'status': 'Active'})
        print(response.data)
