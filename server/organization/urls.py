"""
Holds urls related to organization app.
"""

from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'organization', views.OrganizationViewSet, basename='organization')

urlpatterns = [
    path('', include(router.urls)),
    path('InventoryItemRefreshTime/', views.ModifyOrganizationInventoryItemsDataUpdate.as_view()),
    path('InventoryItemFile/', views.ModifyOrganizationInventoryItemFile.as_view()),
]
