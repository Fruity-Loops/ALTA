import json
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from user_account.models import CustomUser


class AuditTemplateTestCase(APITestCase):
    fixtures = ["users.json", "organizations.json", "audit_template.json"]

    def setUp(self):
        self.client = APIClient()
        self.url = "/template/"
        self.inventory_manager = CustomUser.objects.get(user_name="im")
        self.org1 = self.inventory_manager.organization

    def test_create_template(self):
        """
        Tests the creation of a template through the post request method, and tests a failing case, when the user
        attempts to create an template for another organization.
        """

        # Template to create
        template = {
            "title": "meaningful title 1",
            "Location": ['A certain location'],
            "Plant": [],
            "Zone": [],
            "Aisle": [],
            "Bin": [],
            "Part_Number": [],
            "Serial_Number": [],
            "description": "",
            "organization": 1,
            "start_date": '2021-01-25T13:50:00',
            "repeat_every": '1',
            "on_day": [True, True, False, False, False, False, False],
            "for_month": [True, True, False, False, False, False, False, False, False, False, False, False],
            "time_zone_utc": "America/Detroit"
        }

        # Creating a template for the user's own organization
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.post(self.url, template, format='json')
        self.assertEqual(request.status_code, status.HTTP_201_CREATED)

        # Attempting to create a template for another organization other than the user's
        template["organization"] = 2
        failed_request = self.client.post(self.url, template, format='json')
        self.assertEqual(failed_request.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_templates(self):
        """
        Tests that the get method works and returns templates that are only related to the user's organization
        and will fail otherwise.
        """
        self.client.force_authenticate(user=self.inventory_manager)
        req = self.client.get(f'{self.url}?organization={self.inventory_manager.organization_id}')
        self.assertEqual(req.status_code, status.HTTP_200_OK)
        for template in req.data:
            self.assertEqual(template["organization"], self.inventory_manager.organization_id)
        self.assertGreater(len(req.data), 0)

        failed_req = self.client.get(f'{self.url}?organization=1234567890')
        self.assertEqual(failed_req.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_a_template(self):
        """
        Testing get method to make sure permissions work along with the functionality
        """
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.get(f'{self.url}c8c1a994-1f7d-4224-9091-2cfebafe2899/')
        self.assertEqual(request.status_code, status.HTTP_200_OK)
        self.assertEqual(request.data["title"], "fewqfwq")

        failed_request = self.client.get(f'{self.url}90788fdd-9cd8-4a96-8402-6e27c9467720/')
        self.assertEqual(failed_request.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_template(self):
        """
        Testing patch method to make sure it functions properly and permissions work as intended
        """

        # getting a template to test on from fixture
        self.client.force_authenticate(user=self.inventory_manager)
        request = self.client.get(f'{self.url}c8c1a994-1f7d-4224-9091-2cfebafe2899/')
        data = request.data

        # parsing data into python object because json fields return strings
        data = {k: json.loads(v.replace("\'", "\"")) if isinstance(v, str) and '[' in v else v for k, v in data.items()}
        self.assertEqual(data['Plant'], [])

        # creating and testing successful patch
        data['Plant'].append("new plant")
        patch_req = self.client.patch(f'{self.url}c8c1a994-1f7d-4224-9091-2cfebafe2899/', data, format='json')
        self.assertEqual(patch_req.status_code, status.HTTP_200_OK)
        new_template = self.client.get(f'{self.url}c8c1a994-1f7d-4224-9091-2cfebafe2899/')
        self.assertEqual(new_template.data['Plant'], "['new plant']")

        # ensuring users can't patch templates for which they are not authorized
        failed_patch = self.client.patch(f'{self.url}90788fdd-9cd8-4a96-8402-6e27c9467720/', data, format='json')
        self.assertEqual(failed_patch.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        """
        Testing delete method to make sure it functions properly and permissions work as intended
        """

        # testing deletion successful path
        self.client.force_authenticate(user=self.inventory_manager)
        successful_request = self.client.delete(f'{self.url}c8c1a994-1f7d-4224-9091-2cfebafe2899/')
        self.assertEqual(successful_request.status_code, status.HTTP_204_NO_CONTENT)

        # ensuring users can't delete templates from other organizations
        failed_delete = self.client.delete(f'{self.url}90788fdd-9cd8-4a96-8402-6e27c9467720/')
        self.assertEqual(failed_delete.status_code, status.HTTP_403_FORBIDDEN)
