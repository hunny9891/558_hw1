from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()
router.register(r'images', views.ImageViewSet)

urlpatterns = [
    path(r'api/images', views.transactions),
    path(r'api-auth/', include('rest_framework.urls',
                               namespace='rest_framework'))
]