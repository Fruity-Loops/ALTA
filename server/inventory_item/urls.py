from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'item', views.ItemViewSet, basename='item')

urlpatterns = [
    path('', include(router.urls)),
]