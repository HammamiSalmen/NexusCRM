from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet,
    ContactViewSet,
    CreateAdminBySuperAdminView,
    CreateSuperAdminView,
    InteractionViewSet,
    RegisterAdminView,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"clients", ClientViewSet, basename="client")
router.register(r"contacts", ContactViewSet, basename="contact")
router.register(r"interactions", InteractionViewSet, basename="interaction")

urlpatterns = [
    path("auth/register/", RegisterAdminView.as_view(), name="register"),
    path("auth/create-admin/", CreateAdminBySuperAdminView.as_view()),
    path("auth/create-superadmin/", CreateSuperAdminView.as_view()),
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("", include(router.urls)),
]
