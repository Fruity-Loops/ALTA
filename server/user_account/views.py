"""
This file provides functionality for all the endpoints for interacting with user accounts
"""

from django.contrib.auth.hashers import check_password
from rest_framework import status, viewsets, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user_account.permissions import IsSystemAdmin, IsCurrentUserTargetUser, IsInventoryManager
from .serializers import UserSerializer, LoginSerializer, LoginMobileSerializer,\
     ClientGridSerializer, UserPasswordSerializer
from .models import CustomUser


class CustomUserView(viewsets.ModelViewSet):
    """
    Creates a new user in the db using POST.
    Gets a specific user from db using GET.
    Updates a specific user information using PATCH.
    Updates a specific user password using PUT.
    """
    queryset = CustomUser.objects.all()
    http_method_names = ['post', 'get', 'patch', 'list']

    def get_serializer_class(self):
        """
        Overriding default serializer class to specify custom serializer
        for each view action
        :param: actions
        :return: serializer
        """
        if self.action == 'partial_update' and 'password' not in self.request.data:
            return ClientGridSerializer
        elif self.action == 'partial_update':
            return UserPasswordSerializer
        return UserSerializer

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        Overriding default permission class to specify custom permission
        for each view action
        :param: actions
        :return: permission
        """
        if self.action in ['retrieve']:
            permission_classes = [IsAuthenticated, (IsSystemAdmin | IsInventoryManager)]
        elif self.action in ['partial_update']:
            permission_classes = [IsAuthenticated, IsCurrentUserTargetUser]
        # TODO: Validate requested user id matches requested organization in DB
        # for permissions unrelated to create
        elif self.action in ['create', 'list']:
            permission_classes = [IsAuthenticated, IsInventoryManager | IsSystemAdmin]
        else:
            permission_classes = [IsAuthenticated, IsSystemAdmin]
        return [permission() for permission in permission_classes]

    def create(self, request, *args, **kwargs):
        """
        :param request: request.data: first_name,
        last_name, user_name, password, role, email, is_active
        :return: user_name, token
        """
        # Retrieve the authenticated user making the request
        auth_content = {
            'user': str(request.user),
            'auth': str(request.auth),
        }

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if user.organization is None:
            data = {'user': user.user_name, 'organization': '',
                            'token': auth_content['auth']}
        else:
            data = {'user': user.user_name, 'organization': user.organization.org_id,
                        'token': auth_content['auth']}

        return Response(data, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.get_queryset().filter(organization_id=request.GET.get("organization", ''))\
            .exclude(role='SA').exclude(id=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class OpenRegistrationView(viewsets.ModelViewSet):
    """
    OPEN REGISTRATION VIEW THAT ALLOWS FOR ANY REGISTRATION
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        """
        :param request: request.data: first_name,
        last_name, user_name, password, role, email, is_active
        :return: user_name, token
        """

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        if user.organization is None:
            data = {'user': user.user_name, 'organization': ''}
        else:
            data = {'user': user.user_name, 'organization': user.organization.org_id }
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """
    Authenticate a System Admin.
    """
    serializer_class = LoginSerializer

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
        response = None

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

        finally:
            if response:
                return response
            return Response({"detail": "Failed to Login"}, status=status.HTTP_401_UNAUTHORIZED)


class LoginMobileView(generics.GenericAPIView):
    """
    Authenticate a Mobile Log in.
    """
    serializer_class = LoginMobileSerializer

    def post(self, request):
        pass # TODO: Implement mobile specific endpoint
             # Should be implemented when different options to password auth are determined

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


class AccessMembers(viewsets.ModelViewSet):
    """
    Allows obtaining all clients and updating them
    """
    http_method_names = ['get']
    serializer_class = ClientGridSerializer
    permission_classes = [IsAuthenticated, IsSystemAdmin]

    def get_queryset(self):
        return CustomUser.objects.filter(role='SA').exclude(id=self.request.user.id)
