from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'audit', views.AuditViewSet, basename='audit')
router.register(r'bin-to-sk', views.BinToSKViewSet, basename='bin-to-sk')

urlpatterns = [
    path('', include(router.urls))
]
