"""
This file provides functionality for all the endpoints for interacting with user accounts
"""
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status, viewsets, generics
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from user_account.permissions import IsSystemAdmin, IsCurrentUserTargetUser,\
IsInventoryManager, IsHigherInOrganization, CanUpdate
from .serializers import CustomUserSerializer
from .models import CustomUser


class OpenRegistrationView(viewsets.ModelViewSet):
    """
    OPEN REGISTRATION VIEW THAT ALLOWS FOR ANY REGISTRATION
    """
    http_method_names = ['post']

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = list(self.request.data.keys())
        return serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        """
        :param request: request.data: first_name,
        last_name, user_name, password, role, email, is_active
        :return: user_name, token
        """
        user = None
        data = None
        if request.data:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
        if user:
            data = {'success': 'success'}
        if not data:
            return Response({'error': 'failed'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(data, status=status.HTTP_201_CREATED)


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
            return response

        return response


class LoginMobileView(generics.GenericAPIView):
    """
    Authenticate a Mobile Log in.
    """
    serializer_class = CustomUserSerializer

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


class CustomUserView(viewsets.ModelViewSet):
    http_method_names = ['get', 'post', 'patch']

    def get_permissions(self):
        if self.action in ['create', 'retrieve', 'list']:
            permission_classes = [IsAuthenticated, (IsSystemAdmin | IsInventoryManager)]
        elif self.action in ['partial_update']:
            permission_classes = [IsAuthenticated, CanUpdate]
        else:
            permission_classes = [IsAuthenticated, IsSystemAdmin]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        final_queryset = CustomUser.objects.filter().exclude()
        return final_queryset

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        if self.action == 'partial_update':
            serializer_class.Meta.fields = list(self.request.data.keys())
        elif self.action == 'create':
            serializer_class.Meta.fields = list(self.request.data.keys())
        else:
            serializer_class.Meta.fields = [
                'first_name',
                'last_name',
                'email', 'role',
                'is_active',
                'id',
                'location']
        return serializer_class(*args, **kwargs)

    def create(self, request, *args, **kwargs):
        """ returns: user_name, token and organization"""
        # Retrieve the authenticated user making the request
        auth_content = {
            'user': str(request.user),
            'auth': str(request.auth),
        }

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if not user:
            return Response({'status': 'failed because empty info sent'},
                            status=status.HTTP_400_BAD_REQUEST)
        if user.organization is None:
            data = {'user': user.user_name, 'organization': '',
                            'token': auth_content['auth']}
        else:
            data = {'user': user.user_name, 'organization': user.organization.org_id,
                        'token': auth_content['auth']}

        return Response(data, status=status.HTTP_201_CREATED)

    def list(self, request):
        queryset = self.get_queryset().filter(organization_id=request.GET.get("organization", '')) \
            .exclude(role='SA').exclude(id=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs): # pylint: disable=unused-argument
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(data=request.data, partial=partial, context=kwargs['pk'])
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {} # pylint: disable=protected-access

        return Response(serializer.data)


class AccessMembers(viewsets.ModelViewSet):
    """
    Allows obtaining all clients and updating them
    """
    http_method_names = ['get']
    permission_classes = [IsAuthenticated, IsSystemAdmin]

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = ['user_name', 'first_name', 'last_name', 'email',
                  'role', 'location', 'is_active', 'id']
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        return CustomUser.objects.filter(role='SA').exclude(id=self.request.user.id)
