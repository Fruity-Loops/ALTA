from django.urls import path, include
from rest_framework import routers
from . import views

router = routers.DefaultRouter()
router.register(r'audit/record', views.RecordViewSet, basename='record')
router.register(r'audit/bin-to-sk', views.BinToSKViewSet, basename='bin-to-sk')
router.register(r'audit/assignment', views.AssignmentViewSet, basename='assignment')
router.register(r'audit', views.AuditViewSet, basename='audit')
router.register(r'bin-to-sk', views.BinToSKViewSet, basename='bin-to-sk')
router.register(r'record', views.RecordViewSet, basename='record')
router.register(r'assignment', views.AssignmentViewSet, basename='assignment')
router.register(r'recommendation', views.RecommendationViewSet, basename='recommendation')
router.register(r'comment', views.CommentViewSet, basename='comment')
router.register(r'insights', views.InsightsViewSet, basename='insights')

urlpatterns = [
    path('', include(router.urls)),
    path('audit/', include(router.urls)),
    path('bin-to-sk/', include(router.urls)),
    path('comment/', include(router.urls)),
]
