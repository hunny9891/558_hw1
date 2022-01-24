from django.urls import include, path
from rest_framework import routers

from .views import ImageViewSet

router = routers.DefaultRouter()
router.register(r'image', ImageViewSet)

urlpatterns = [
    path(r'^', include(router.urls)),
    path(r'^api-auth/', include('rest_framework.urls',
                               namespace='rest_framework'))
]