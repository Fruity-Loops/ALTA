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
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # creating token
        signals.post_save.send(sender=self.__class__, user=user, request=self.request)
        token = Token.objects.get(user=user).key

        data = {'user': user.user_name, 'token': token}
        return Response(data, status=status.HTTP_201_CREATED)


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        data = request.data
        username = data.get('user_name', '')
        password = data.get('password', '')

        try:
            user = CustomUser.objects.get(user_name=username)
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
        except CustomUser.DoesNotExist:
            return Response({'detail': 'Invalid user'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class LogoutView(generics.GenericAPIView):
    def post(self, request):
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