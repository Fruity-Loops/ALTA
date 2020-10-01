from django.urls import path, include
from . import views
from rest_framework import routers 

router = routers.DefaultRouter()
router.register('auth_users', views.AuthUsersView) # params: endpoint, view

urlpatterns = [
    path('', include(router.urls)),
]
