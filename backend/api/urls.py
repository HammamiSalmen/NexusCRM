from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ClientViewSet,
    ContactViewSet,
    CreateAdminBySuperAdminView,
    CreateSuperAdminView,
    DashboardStatsView,
    InteractionViewSet,
    LoginStepOneView,
    LoginStepTwoView,
    MyTokenObtainPairView,
    NotificationViewSet,
    RegisterAdminView,
    TaskViewSet,
    UserViewSet,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register(r"clients", ClientViewSet, basename="client")
router.register(r"contacts", ContactViewSet, basename="contact")
router.register(r"interactions", InteractionViewSet, basename="interaction")
router.register(r"users", UserViewSet, basename="user")
router.register(r"notifications", NotificationViewSet, basename="notification")
router.register(r"tasks", TaskViewSet, basename="task")

urlpatterns = [
    path("auth/login-step1/", LoginStepOneView.as_view(), name="login_step1"),
    path("auth/login-step2/", LoginStepTwoView.as_view(), name="login_step2"),
    path("auth/register/", RegisterAdminView.as_view(), name="register"),
    path("dashboard/", DashboardStatsView.as_view()),
    path("auth/create-admin/", CreateAdminBySuperAdminView.as_view()),
    path("auth/create-superadmin/", CreateSuperAdminView.as_view()),
    path("token/", MyTokenObtainPairView.as_view(), name="get_token"),
    path("token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("", include(router.urls)),
]
