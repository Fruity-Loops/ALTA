from django.db.models import signals
from django.contrib.auth.hashers import check_password
from rest_framework import status, viewsets, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from .serializers import UserSerializer, LoginSerializer, ClientGridSerializer
from .models import CustomUser



class RegistrationView(viewsets.ModelViewSet):

    """
    Creates a new user in the db.
    """
    permission_classes = [IsAuthenticated]
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post']

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

        data = {'user': user.user_name,'token': auth_content['auth']}
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

        data = {'user': user.user_name, 'token': token}
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

                    data = {'user': username, 'role': user.role,  'token': token.key}
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

    def remove_token(self, request): # pylint: disable=no-self-use
        """
        Deleting user token from the database when he logout.
        :param request
        """

        try:
            Token.objects.get(user=request.user).delete()
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid Token'},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"success": "Successfully logged out."},
                        status=status.HTTP_200_OK)


class AccessClients(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = ClientGridSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post']

    @action(detail=False, methods=['POST'])
    def post(self, request):
        data = request.data
        first_name = data.get('name', '')
        qs = CustomUser.objects.filter(first_name=first_name)
        serializer = ClientGridSerializer(instance=qs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['POST'])
    def update_client(self, request):
        data = request.data
        variable_column = data.get('category', '')
        entry = data.get('field', '')
        id1 = data.get('id', '')
        if entry == 'false':
            entry = False
        elif entry == 'true':
            entry = True
        CustomUser.objects.filter(id=id1).update(**{variable_column: entry})
        serializer = ClientGridSerializer(instance=self.get_queryset(), many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
