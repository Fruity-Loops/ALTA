from django.db.models import signals
from django.contrib.auth.hashers import check_password
from rest_framework import status, viewsets, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django_server.permissions import IsCurrentUserTargetUser
from .serializers import UserSerializer, LoginSerializer, ClientGridSerializer, \
    UserProfileSerializer, UserPasswordSerializer
from .models import CustomUser
from .permissions import UserAccountPermission


class CustomUserView(viewsets.ModelViewSet):
    """
    Creates a new user in the db.
    Gets a specific user from db.
    """
    permission_classes = [IsAuthenticated, UserAccountPermission]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post', 'get']

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

        auth_user = CustomUser.objects.get(user_name=auth_content['user'])
        # TODO: Limit account creation by role
        if auth_user.role != 'SA':
            pass

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

        # creating token
        signals.post_save.send(sender=self.__class__,
                               user=user, request=self.request)
        token = Token.objects.get(user=user).key

        if user.organization is None:
            data = {'user': user.user_name, 'organization': '', 'token': token}
        else:
            data = {'user': user.user_name, 'organization': user.organization.org_id,
                    'token': token}
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    """
    Authenticate a System Admin.
    """
    serializer_class = LoginSerializer

    def post(self, request):
        """
        Verify that a System Admin has valid credentials and is active.
        :param request: request.data: user_name, password
        :return: user_name, token
        """
        data = request.data
        username = data.get('user_name', '')
        password = data.get('password', '')

        try:
            user = CustomUser.objects.get(user_name=username)

            if user.is_active:
                encrypted_password = user.password
                is_verified = check_password(password, encrypted_password)
                if is_verified:
                    has_token = Token.objects.filter(user=user).count()
                    if has_token:
                        token = Token.objects.get(user=user)
                    else:
                        token = Token.objects.create(user=user)

                    if user.organization is None:
                        data = {'user': username, 'role': user.role,
                                'organization': '', 'token': token.key}
                    else:
                        data = {'user': username, 'role': user.role,
                                'organization_id': user.organization.org_id,
                                'organization_name': user.organization.org_name,
                                'token': token.key}

                    return Response(data, status=status.HTTP_200_OK)

                return Response({'detail': 'Invalid credentials'},
                                status=status.HTTP_401_UNAUTHORIZED)

            return Response({'detail': 'Please contact admin to activate your account'},
                            status=status.HTTP_401_UNAUTHORIZED)

        except CustomUser.DoesNotExist:
            return Response({'detail': 'Invalid user'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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


class AccessAllClients(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = ClientGridSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get']


class AccessSomeClients(generics.GenericAPIView):
    http_method_names = ['post']
    queryset = CustomUser.objects.all()
    serializer_class = ClientGridSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data
        first_name = data.get('name', '')
        qs = CustomUser.objects.filter(first_name=first_name)
        serializer = ClientGridSerializer(instance=qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class UpdateUserProfileView(generics.UpdateAPIView):
    """
    This view will only be responsible of updating Logged In user own information
    Http_methods_allowed are PUT and PATCH
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated, IsCurrentUserTargetUser]


class ChangePasswordView(generics.UpdateAPIView):
    """
    This view will only be responsible of updating Logged In user own information
    Http_methods_allowed are PUT and PATCH
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserPasswordSerializer
    permission_classes = [IsAuthenticated, IsCurrentUserTargetUser]
