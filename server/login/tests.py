from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.authtoken.models import Token
from user_account.models import CustomUser


class LoginTest(APITestCase):
    fixtures = ["users.json", "organizations.json"]

    def test_login_invalid_user(self):
        """ User that does not exist in database """
        response = self.client.post(
            "/login/", {"email": "t@test.com", "password": "test"})
        self.assertEqual(response.status_code,
                         status.HTTP_401_UNAUTHORIZED)

    def test_login_wrong_credentials(self):
        """ User that has wrong credentials """
        response = self.client.post(
            "/login/", {"email": "sa2@test.com", "password": "test12"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_not_active(self):
        """ User that has a valid account but is not active """
        response = self.client.post(
            "/login/", {"email": "sa2@test.com", "password": "sa"})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_users_with_or_without_organization(self):
        response = self.client.post("/login/", {'email': 'sa@test.com', 'password': 'password'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['organization_name'], "")

        response = self.client.post("/login/", {'email': 'sk@test.com', 'password': 'password',\
                                                'organization': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['organization_name'], 'test')


class LogoutTest(APITestCase):
    fixtures = ["users.json", "organizations.json"]

    def setUp(self):
        user = CustomUser.objects.get(user_name="sa")

        self.token = Token.objects.create(user=user)
        self.api_authentication_valid_token()

    def api_authentication_valid_token(self):
        """ Added valid token header to request """
        # pylint: disable=no-member
        self.client.credentials(HTTP_AUTHORIZATION="Token " + str(self.token))

    def api_authentication_invalid_token(self):
        """ Added invalid token header to request"""
        # pylint: disable=no-member
        self.client.credentials(
            HTTP_AUTHORIZATION="Token " + "57c5c737d366de975d168f87f9ff535285c02af0")

    def test_logout_success(self):
        """ User can logout successfully with valid token """
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_logout_failure(self):
        """ User can't logout without a valid token """
        self.api_authentication_invalid_token()
        response = self.client.post('/logout/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class LoginMobileTestCase(APITestCase):
    fixtures = ["users.json", "organizations.json"]

    def test_send_email(self):
        """ User that does not exist in database """
        response = self.client.post(
            "/login-mobile/", {"email": "sk@test.com"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user'], 'sk')
        self.assertEqual(response.data['user_id'], 3)
        self.assertEqual(response.data['role'], 'SK')
        self.assertEqual(response.data['organization_name'], 'test')
        self.assertEqual(response.data['organization_id'], 1)

    def test_login_wrong_credentials(self):
        """ User that has wrong credentials """
        response = self.client.post(
            "/login-mobile/", {"email": "sa2@test.com"}, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_send_pin(self):
        """ User that has sent the correct PIN may log in """
        response = self.client.post(
            "/login-mobile-pin/", {"email": "sk@test.com", 'pin': 'password'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertNotEqual(response.data['token'], None)
