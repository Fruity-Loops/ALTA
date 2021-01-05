from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'audit', views.AuditViewSet, basename='audit')
router.register(r'assigned-sk', views.AssignedSKViewSet, basename='assigned-sk')

urlpatterns = [
    path('', include(router.urls))
]
