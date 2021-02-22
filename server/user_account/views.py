"""
This file provides functionality for all the endpoints for interacting with user accounts
"""
from rest_framework import status
from rest_framework.response import Response

from django_server.custom_logging import LoggingViewset
from user_account.permissions import CanUpdateKeys, IsHigherInOrganization, \
    UserHasSameOrg, PermissionFactory
from .serializers import CustomUserSerializer
from .models import CustomUser


class OpenRegistrationView(LoggingViewset):
    """
    OPEN REGISTRATION VIEW THAT ALLOWS FOR ANY REGISTRATION
    """
    http_method_names = ['post']

    def get_permissions(self):
        super().set_request_data(self.request)
        permission_classes = []
        return [permission() for permission in permission_classes]

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


class CustomUserView(LoggingViewset):
    http_method_names = ['get', 'post', 'patch']
    data = None

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = PermissionFactory(self.request)
        if self.action in ['create', 'retrieve', 'list']:
            permission_classes = factory.get_general_permissions([
                UserHasSameOrg, IsHigherInOrganization])
        elif self.action in ['partial_update']:
            permission_classes = factory.get_general_permissions([
                IsHigherInOrganization, CanUpdateKeys])
        else:
            permission_classes = factory.get_general_permissions([])
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        final_queryset = CustomUser.objects.filter().exclude()
        return final_queryset

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        if self.action == 'partial_update':
            serializer_class.Meta.fields = list(self.data.keys())
        elif self.action == 'create':
            serializer_class.Meta.fields = list(self.request.data.keys())
        else:
            serializer_class.Meta.fields = [
                'first_name',
                'last_name',
                'email', 'role',
                'is_active',
                'id',
                'location',
                'organization',
                'user_name']
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
        """
        It's important to be careful if this queryset is modified, as there are plenty of
        possibilities to list out employees, and there may be a way to make it vulnerable
        if this is changed (although it shouldn't)
        """
        queryset = self.get_queryset().filter(organization_id=request.GET.get("organization", '')) \
            .exclude(role='SA').exclude(id=request.user.id)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):  # pylint: disable=unused-argument
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        self.data = dict(self.request.data)
        # deleting role key from dictionary to make sure it is not modifiable
        self.data.pop('role', None)
        serializer = self.get_serializer(data=self.data, partial=partial, context=kwargs['pk'])
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}  # pylint: disable=protected-access

        return Response(serializer.data)


class AccessMembers(LoggingViewset):
    """
    Allows obtaining all clients and updating them
    """
    http_method_names = ['get']

    def get_permissions(self):
        super().set_request_data(self.request)
        factory = PermissionFactory(self.request)
        permission_classes = factory.base_sa_permissions
        return [permission() for permission in permission_classes]

    def get_serializer(self, *args, **kwargs):
        serializer_class = CustomUserSerializer
        serializer_class.Meta.fields = ['user_name', 'first_name', 'last_name', 'email',
                                        'role', 'location', 'is_active', 'id']
        return serializer_class(*args, **kwargs)

    def get_queryset(self):
        return CustomUser.objects.filter(role='SA').exclude(id=self.request.user.id)
