"""
Holds urls related to audit template app.
"""

from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'template', views.AuditTemplateViewSet, basename='template')

urlpatterns = [
    path('', include(router.urls)),
]
