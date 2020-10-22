"""
Holds urls related to user_account app.
"""

from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'registration', views.RegistrationView, basename='registration')
router.register(r'open-registration', views.OpenRegistrationView, basename='open_registration')
router.register(r'getAllClients', views.AccessAllClients, basename='getAllClients/')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('getSomeClients/', views.AccessSomeClients.as_view()),
    path('modifyClient/', views.ModifyClient.as_view()),
]
