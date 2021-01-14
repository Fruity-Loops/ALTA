from datetime import datetime

from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from user_account.models import CustomUser
import json


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
            "organization": 1,
            "startDateObj": datetime.now(),
            "repeatEvery": '1',
            "onDay": [True, True, False, False, False, False, False],
            "forMonth": [True, True, False, False, False, False, False, False, False, False, False, False],
            "timeZoneUTC": "America/Detroit"
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

        failed_req = self.client.get(f'{self.url}?organization=1234567890')
        self.assertEqual(failed_req.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_a_template(self):
        """
        Testing get method to make sure permissions work along with the functionality
        """
        self.client.force_authenticate(user=self.user1)
        req = self.client.get(f'{self.url}8/')
        self.assertEqual(req.status_code, status.HTTP_200_OK)
        self.assertEqual(req.data["title"], "fewqfwq")

        failed_req = self.client.get(f'{self.url}7/')
        self.assertEqual(failed_req.status_code, status.HTTP_403_FORBIDDEN)

    def test_patch_template(self):
        """
        Testing patch method to make sure it functions properly and permissions work as intended
        """

        # getting a template to test on from fixture
        self.client.force_authenticate(user=self.user1)
        req = self.client.get(f'{self.url}8/')
        data = req.data

        # parsing data into python object because json fields return strings
        data = {k: json.loads(v.replace("\'", "\"")) if isinstance(v, str) and '[' in v else v for k, v in data.items()}
        self.assertEqual(data['plant'], [])

        # creating and testing successful patch
        data['plant'].append("new plant")
        patch_req = self.client.patch(f'{self.url}8/', data, format='json')
        self.assertEqual(patch_req.status_code, status.HTTP_200_OK)
        new_template = self.client.get(f'{self.url}8/')
        self.assertEqual(new_template.data['plant'], "['new plant']")

        # ensuring users can't patch templates for which they are not authorized
        failed_patch = self.client.patch(f'{self.url}7/', data, format='json')
        self.assertEqual(failed_patch.status_code, status.HTTP_403_FORBIDDEN)

    def test_delete(self):
        """
        Testing delete method to make sure it functions properly and permissions work as intended
        """

        # testing deletion successful path
        self.client.force_authenticate(user=self.user1)
        successful_req = self.client.delete(f'{self.url}8/')
        self.assertEqual(successful_req.status_code, status.HTTP_204_NO_CONTENT)

        # ensuring users can't delete templates from other organizations
        failed_delete = self.client.delete(f'{self.url}7/')
        self.assertEqual(failed_delete.status_code, status.HTTP_403_FORBIDDEN)
