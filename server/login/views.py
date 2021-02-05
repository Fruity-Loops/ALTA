"""
This file provides functionality for all the endpoints for interacting with user accounts
"""
import string, random
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, generics
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from user_account.serializers import CustomUserSerializer
from user_account.models import CustomUser
from user_account.views import CustomUserView
from django.http import HttpRequest


class LoginView(generics.GenericAPIView):
    """
    Authenticate a System Admin.
    """

    # serializer_class = CustomUserSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = ['email', 'password']
        return serializer_class(*args, **kwargs)

    def post(self, request):
        """
        Verify that a System Admin has valid credentials and is active.
        :param request: request.data: email, password
        :return: user_name, token
        """
        data = request.data
        email = data.get('email', '')
        password = data.get('password', '')
        org_id = ""
        org_name = ""
        response = Response({"detail": "Login Failed"},
                            status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = CustomUser.objects.get(email=email)

            is_verified = check_password(password, user.password)
            if is_verified and user.is_active:
                has_token = Token.objects.filter(user=user).count()
                if has_token:
                    token = Token.objects.get(user=user)
                else:
                    token = Token.objects.create(user=user)
                if user.organization:
                    org_id = user.organization.org_id
                    org_name = user.organization.org_name
                data = {'user': user.user_name, 'user_id': user.id, 'role': user.role,
                        'organization_id': org_id,
                        'organization_name': org_name,
                        'token': token.key}

                response = Response(data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            pass

        return response


class LoginMobileEmailView(generics.GenericAPIView):
    """
    Authenticate a Mobile Log in.
    """
    serializer_class = CustomUserSerializer

    def save_new_pin(self, email, user):
        first_part = ''.join(random.choice(string.ascii_uppercase) for i in range(3))
        second_part = '-'
        third_part = ''.join(random.choice(string.ascii_uppercase) for i in range(3))
        request = HttpRequest()
        request.data = {'password': first_part + second_part + third_part}
        request.user = email
        kwargs = {'partial': True, 'pk': user.id}
        custom_user_view = CustomUserView()
        custom_user_view.kwargs = kwargs
        custom_user_view.request = request
        custom_user_view.action = 'partial_update'
        custom_user_view.data = request.data
        custom_user_view.update(request=request, **kwargs)

    def post(self, request):
        data = request.data
        email = data.get('email', '')
        response = Response({"detail": "Login Failed"},
                            status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = CustomUser.objects.get(email=email)

            if user.is_active:
                org_id = user.organization.org_id
                org_name = user.organization.org_name
                data = {'user': user.user_name, 'user_id': user.id, 'role': user.role,
                        'organization_id': org_id,
                        'organization_name': org_name}

                # Update the Password as the new PIN and send an email
                self.save_new_pin(email, user)
                response = Response(data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            pass

        return response


class LoginMobilePinView(generics.GenericAPIView):
    """
    Authenticate a System Admin.
    """

    # serializer_class = CustomUserSerializer

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = ['email', 'password']
        return serializer_class(*args, **kwargs)

    def post(self, request):
        """
        Verify that a System Admin has valid credentials and is active.
        :param request: request.data: email, password
        :return: user_name, token
        """
        data = request.data
        email = data.get('email', '')
        password = data.get('pin', '')
        response = Response({"detail": "Login Failed"},
                            status=status.HTTP_401_UNAUTHORIZED)

        try:
            user = CustomUser.objects.get(email=email)

            is_verified = check_password(password, user.password)
            if is_verified and user.is_active:
                has_token = Token.objects.filter(user=user).count()
                if has_token:
                    token = Token.objects.get(user=user)
                else:
                    token = Token.objects.create(user=user)
                data = {'token': token.key}

                response = Response(data, status=status.HTTP_200_OK)

        except ObjectDoesNotExist:
            return response

        return response


class LogoutView(generics.GenericAPIView):
    """
    Logout a System Admin.
    """

    def post(self, request):
        """
        :param request: request.user (token)
        """
        return self.remove_token(request)

    def remove_token(self, request):  # pylint: disable=no-self-use
        """
        Deleting user token from the database when he logout.
        :param request
        """

        Token.objects.get(user=request.user).delete()

        return Response({"success": "Successfully logged out."},
                        status=status.HTTP_200_OK)
