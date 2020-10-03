from django.db.models import signals
from rest_framework import status
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework import viewsets
from .models import CustomUser
from .serializers import UserSerializer, LoginSerializer
from rest_framework import generics
from django.contrib import auth
from django.contrib.auth.hashers import check_password


class RegistrationView(viewsets.ModelViewSet):
    """
    Creates a new System Admin in the db.
    """
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
    http_method_names = ['post']

    def create(self, request, *args, **kwargs):
        """
        :param request: request.data: first_name, last_name, user_name, password, role, email, is_active
        :return: user_name, token
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # creating token
        signals.post_save.send(sender=self.__class__, user=user, request=self.request)
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
        username = data.get('username', '')
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

                    data = {'user': username, 'token': token.key}
                    return Response(data, status=status.HTTP_200_OK)
                else:
                    return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
                    pass
            else:
                return Response({'detail': 'Please contact admin to activate your account'},
                                status=status.HTTP_401_UNAUTHORIZED)

        except CustomUser.DoesNotExist:
            return Response({'detail': 'Invalid user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(generics.GenericAPIView):
    """
    Logout a System Admin.
    """
    def post(self, request):
        """
        :param request: request.user (token)
        """
        return self.remove_token(request)

    def remove_token(self, request):
        """
        Deleting user token from the database when he logout.
        :param request
        """

        try:
            Token.objects.get(user=request.user).delete()
        except Token.DoesNotExist:
            return Response({'detail': 'Invalid Token'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            pass

        return Response({"success": "Successfully logged out."},
                        status=status.HTTP_200_OK)
