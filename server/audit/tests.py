from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from organization.models import Organization
from user_account.models import CustomUser
from inventory_item.models import Item
from .models import Audit, BinToSK


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
        self.item_one = Item.objects.get(Batch_Number=12731369)
        self.item_two = Item.objects.get(Batch_Number=12752842)
        self.audit = Audit.objects.create()
        self.audit.inventory_items.add(self.item_one.Batch_Number, self.item_two.Batch_Number)  # check if this was there before

    def test_audit_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one.Batch_Number, self.item_two.Batch_Number]},
                                    format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_create_audit_as_sa(self):
        """ Create audit as system admin """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one.Batch_Number, self.item_two.Batch_Number],
                                     "organization": 1,
                                     "initiated_by": self.system_admin.id
                                     }, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)

        self.assertEqual(response.data['inventory_items'][0], self.item_one.Batch_Number)
        self.assertEqual(response.data['inventory_items'][1], self.item_two.Batch_Number)
        self.assertEqual(response.data['organization'], 1)

    def test_create_audit_as_im_bad_org(self):
        """ Try to create audit as inventory manager from another organization """
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one.Batch_Number, self.item_two.Batch_Number],
                                     "organization": 3}, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_create_audit_as_im(self):
        """ Create audit as inventory manager from their organization """
        self.client.force_authenticate(user=self.inv_manager)

        # create initial audit with inventory items
        response = self.client.post("/audit/",
                                    {"inventory_items": [self.item_one.Batch_Number, self.item_two.Batch_Number],
                                     "organization": self.inv_manager.organization.org_id,
                                     "initiated_by": self.inv_manager.id},
                                    format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)

        self.assertEqual(response.data['inventory_items'][0], self.item_one.Batch_Number)
        self.assertEqual(response.data['inventory_items'][1], self.item_two.Batch_Number)
        self.assertEqual(response.data['organization'], self.org_id.org_id)

    def test_update_audit_with_sks(self):
        """ Update an audit as inventory manager to assign stock-keepers """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(pk=1)

        response = self.client.patch('/audit/'f'{self.predefined_audit.audit_id}/',
                                     {"assigned_sk": [self.stock_keeper.id]}, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_200_OK)

        self.assertEqual(response.data['organization'], self.org_id.org_id)
        self.assertEqual(response.data['assigned_sk'][0], self.stock_keeper.id)

    def test_update_audit_with_im_bad_org(self):
        """ Try to access an audit as inventory manager from other organization """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(pk=3)

        response = self.client.get('/audit/'f'{self.predefined_audit.audit_id}/')

        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_get_audit(self):
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.get('/audit/', {'organization': 1, 'status': 'Active'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['audit_id'], 1)
        self.assertEqual(response.data[0]['status'], 'Active')
        self.assertEqual(response.data[0]['organization'], 1)
        self.assertEqual(response.data[0]['inventory_items'], [])
        self.assertEqual(response.data[0]['assigned_sk'], [])

    
    def test_check_item(self):
        self.client.force_authenticate(user=self.stock_keeper)
        response = self.client.get(
            "/audit/check_item/",
            {
                'item_id': 12852846,
                'bin_id': 3,
                'audit_id': 2
            })



class BinTestCase(APITestCase):
    fixtures = ["items.json", "users.json", "organizations.json", "audits.json", "bins.json"]

    def setUp(self):
        self.client = APIClient()

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.inv_manager = CustomUser.objects.get(user_name="im")
        self.stock_keeper = CustomUser.objects.get(user_name="sk")

        # Create the affiliated organization
        self.org_id = Organization.objects.get(org_id="1")

        # Create audit components
        self.item_one = Item.objects.get(Batch_Number=12731370)
        self.item_two = Item.objects.get(Batch_Number=12752843)
        self.audit = Audit.objects.create()
        self.audit.inventory_items.add(self.item_one.Batch_Number, self.item_two.Batch_Number)  # check if this was there before

    def test_bin_to_sk_create(self):
        """ Create BinToSK designation as inventory manager """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(pk=1)
        request_body = {
            "Bin": "A10",
            "init_audit": self.predefined_audit.audit_id,
            "customuser": self.stock_keeper.id,
            "item_ids": [self.item_one.Batch_Number, self.item_two.Batch_Number],
        }
        response = self.client.post("/bin-to-sk/", request_body, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['Bin'], "A10")
        self.assertEqual(response.data['init_audit'], self.predefined_audit.audit_id)
        self.assertEqual(response.data['customuser'], self.stock_keeper.id)
        self.assertEqual(response.data['item_ids'], str([self.item_one.Batch_Number, self.item_two.Batch_Number]))

    def test_bin_to_sk_diff_org_create(self):
        """ Create BinToSK designation as inventory manager to SK in a different organization"""
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(pk=1)
        request_body = {"bin_id": 1, "Bin": "A10", "init_audit": self.predefined_audit.audit_id,
                        "customuser": 5, "item_ids": [12731370], 'customuser': 6}
        new_response = self.client.post("/bin-to-sk/", request_body, format='json')
        self.assertEqual(new_response.status_code, status.HTTP_403_FORBIDDEN)

    def test_bin_to_sk_bad_org_create(self):
        """ Try to create BinToSK designation as inventory manager from another organization """
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(pk=3)
        response = self.client.post("/bin-to-sk/",
                                    {
                                        "bin_id": 1,
                                        "Bin": "A10",
                                        "init_audit": self.predefined_audit.audit_id,
                                        "customuser": 6,
                                        "item_ids": [12731370],
                                    }, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_403_FORBIDDEN)

    def test_bin_to_sk_list(self):
        """ Verifying all the correct data is returned """
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.get("/bin-to-sk/", {"customuser_id": 3, "init_audit_id": 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['bin_id'], 2)
        self.assertEqual(response.data[0]['Bin'], 'C20')
        self.assertEqual(response.data[0]['customuser']['user_name'], 'sk')
        self.assertEqual(response.data[0]['item_ids'], str([int(item) for item in
                                                            [self.item_one.Batch_Number, self.item_two.Batch_Number]]))

    def test_bin_to_sk_retrieve(self):
        self.client.force_authenticate(user=self.inv_manager)
        response = self.client.get("/bin-to-sk/2/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['bin_id'], 2)
        self.assertEqual(response.data['Bin'], 'C20')
        self.assertEqual(response.data['customuser']['user_name'], 'sk')
        self.assertEqual(response.data['item_ids'], str([int(item) for item in
                                                         [self.item_one.Batch_Number, self.item_two.Batch_Number]]))

    def test_bins_get_items(self):
        self.client.force_authenticate(user=self.inv_manager)
        self.predefined_audit = Audit.objects.get(pk=1)
        response = self.client.get("/bin-to-sk/items/", {'bin_id': 3, 'audit_id': 2})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class RecordTestCase(APITestCase):
    fixtures = ["items.json", "users.json", "organizations.json", "audits.json", "bins.json"]

    def setUp(self):
        self.client = APIClient()

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.get(user_name="sa")
        self.inv_manager = CustomUser.objects.get(user_name="im")
        self.stock_keeper = CustomUser.objects.get(user_name="sk")

        # Create the affiliated organization
        self.org_id = Organization.objects.get(org_id="1")

        # Create audit components
        self.item_one = Item.objects.get(Batch_Number=12731370)
        self.item_two = Item.objects.get(Batch_Number=12752843)
        self.audit = Audit.objects.create()
        self.audit.inventory_items.add(self.item_one.Batch_Number, self.item_two.Batch_Number)  # check if this was there before


    def test_create_record(self):
        self.client.force_authenticate(user=self.inv_manager)
        self.audit = Audit.objects.get(pk=1)
        self.bin = BinToSK.objects.get(pk=1)
        response = self.client.post(
            "/record/",
            {
                "status": "Pending",
                "audit": self.audit.audit_id,
                "bin_to_sk": self.bin.bin_id,
                "item_id": self.item_one.Batch_Number,
                "location": "YUL",
                
            }, format="json")
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)
