from django.urls import include, path

from . import views

urlpatterns = [
    path(r'api/images', views.transactions),
    path(r'api/images/favorites', views.get_favorites),
    path(r'api-auth/', include('rest_framework.urls',
                               namespace='rest_framework'))
]
