"""
Holds urls related to user_account app.
"""

from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'user', views.CustomUserView, basename='user')
router.register(r'open-registration', views.OpenRegistrationView, basename='open_registration')
router.register(r'accessClients', views.AccessMembers, basename='accessClients')
router.register(r'accessPagedClients', views.AccessMembersPaginated, basename='accessPagedClients')

urlpatterns = [
    path('', include(router.urls)),
]
