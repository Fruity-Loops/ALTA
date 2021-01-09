from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from user_account.models import CustomUser

class AuditTemplateTestCase(APITestCase):
    fixtures = ["users.json", "organizations.json", "audit_template.json"]

    def setUp(self):
        self.client = APIClient()
        self.url = "/template/"
        self.user1 = CustomUser.objects.get(user_name="im")
        self.org1 = self.user1.organization

    def test_create_template(self):
        """
        Tests the creation of a template through the post request method, and tests a failing case, when the user attempts
        to create an template for another organization.
        """

        # Template to create
        template = {
            "title": "meaningful title 1",
            "location": ['A certain location'],
            "plant": [],
            "zones": [],
            "aisles": [],
            "bins": [],
            "part_number": [],
            "serial_number": [],
            "description": "",
            "organization": 1
        }

        # Creating a template for the user's own organization
        self.client.force_authenticate(user=self.user1)
        req = self.client.post(self.url, template, format='json')
        self.assertEqual(req.status_code, status.HTTP_201_CREATED)

        # Attempting to create a template for another organization other than the user's
        template["organization"] = 2
        failed_request = self.client.post(self.url, template, format='json')
        self.assertEqual(failed_request.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_templates(self):
        """
        Tests that the get method works and returns templates that are only related to the user's organization
        and will fail otherwise.
        """
        self.client.force_authenticate(user=self.user1)
        req = self.client.get(f'{self.url}?organization={self.user1.organization_id}')
        self.assertEqual(req.status_code, status.HTTP_200_OK)
        for template in req.data:
            self.assertEqual(template["organization"], self.user1.organization_id)
        self.assertGreater(len(req.data), 0)
