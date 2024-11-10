"""
URL configuration for hortesie_djangoapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path
from rest_framework.routers import DefaultRouter

from django.conf.urls.static import static
from hortesie_django.views import (
    CCTPTemplateCreateView,
    GenerateCSVAPIView,
    PhotoViewSet,
    ProjectViewset,
)
from hortesie_djangoapp import settings

# Initialize the router
router = DefaultRouter()

# Register the viewset with the router
router.register(r"projects", ProjectViewset, basename="project")
router.register(r"images", PhotoViewSet, basename="image")

urlpatterns = (
    [
        path("admin/", admin.site.urls),
        path("cctp_file/", GenerateCSVAPIView.as_view(), name="generate_csv"),
        path(
            "replace_template/",
            CCTPTemplateCreateView.as_view(),
            name="replace_template",
        ),
    ]
    + router.urls
    + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
)
