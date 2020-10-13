from django.urls import path, include
from . import views
from rest_framework import routers

"""
Holds urls related to user_account app.
"""

router = routers.DefaultRouter()
router.register(r'registration', views.RegistrationView)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', views.LoginView.as_view()),
    path('logout/', views.LogoutView.as_view()),
    path('restricted/', views.restricted),
    path('restricted_class/', views.restricted_class_based_views.as_view())
]
