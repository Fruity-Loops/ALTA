"""
Holds urls related to Logging in
"""

from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('login-mobile/', views.LoginMobileEmailView.as_view()),
    path('login-mobile-pin/', views.LoginMobilePinView.as_view())
]
