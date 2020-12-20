from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from user_account.models import CustomUser
from inventory_item.models import Item
from .models import Audit


class AuditTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        # Create each type of user that could be making the registration request
        self.system_admin = CustomUser.objects.create(
            user_name='system_admin3',
            email='system_admin3@email.com',
            password='password2',
            first_name='system2',
            last_name='admin2',
            role='SA',
            is_active=True)

        self.item_one = Item.objects.create(
            _id=1,
            Location='QC',
            Plant=True,
            Zone='B',
            Aisle=3,
            Part_Number='PART-1',
            Part_Description='DummyPart',
            Serial_Number='SN-4',
            Condition='Servicable',
            Category='SERIALIZED',
            Owner='Me',
            Criticality='3',
            Average_Cost='$900',
            Quantity=7,
            Unit_of_Measure='EA'
        )

        self.item_two = Item.objects.create(
            _id=2,
            Location='QC',
            Plant=True,
            Zone='B',
            Aisle=4,
            Part_Number='PART-2',
            Part_Description='DummyPart',
            Serial_Number='SN-4',
            Condition='Servicable',
            Category='SERIALIZED',
            Owner='Me',
            Criticality='2',
            Average_Cost='$400',
            Quantity=4,
            Unit_of_Measure='EA'
        )

        self.audit = Audit.objects.create()
        self.audit.inventory_items.add(self.item_one._id, self.item_two._id)

    def test_audit_unauthorized_request(self):
        """ User can't access any of the method if token is not in header of request """
        response = self.client.get("/audit/")
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_create_audit(self):
        """ Create audit """
        self.client.force_authenticate(user=self.system_admin)
        response = self.client.post("/audit/", {"inventory_items": [self.item_one._id, self.item_two._id]})
        self.assertEqual(response.status_code,
                         status.HTTP_201_CREATED)
