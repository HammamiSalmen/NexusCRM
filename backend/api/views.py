from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import (
    UserSerializer,
    ClientSerializer,
    ContactSerializer,
    InteractionSerializer,
)
from .models import Client, Contact, Interaction
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["is_superuser"] = user.is_superuser
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["user"] = {
            "id": self.user.id,
            "username": self.user.username,
            "email": self.user.email,
            "is_superuser": self.user.is_superuser,
            "first_name": self.user.first_name,
            "last_name": self.user.last_name,
        }
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class IsSuperUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_superuser
        )


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [IsSuperUser]

    def perform_destroy(self, instance):
        if instance == self.request.user:
            raise PermissionDenied("Vous ne pouvez pas désactiver votre propre compte.")
        instance.is_active = False
        instance.save()

    def get_permissions(self):
        if self.action in ["me", "change_password"]:
            return [permissions.IsAuthenticated()]
        return [IsSuperUser()]

    @action(detail=False, methods=["get", "patch"])
    def me(self, request):
        if request.method == "GET":
            serializer = self.get_serializer(request.user)
            return Response(serializer.data)
        if request.method == "PATCH":
            serializer = self.get_serializer(
                request.user, data=request.data, partial=True
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)

    @action(detail=False, methods=["post"], url_path="change-password")
    def change_password(self, request):
        user = request.user
        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")

        if not user.check_password(current_password):
            return Response(
                {"detail": "L'ancien mot de passe est incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user.set_password(new_password)
        user.save()
        return Response(
            {"detail": "Mot de passe mis à jour avec succès."},
            status=status.HTTP_200_OK,
        )


""" class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperUser] """


class RegisterAdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        # rôle admin (employé)
        serializer.save(is_staff=True, is_superuser=False)


class CreateAdminBySuperAdminView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            raise permissions.PermissionDenied(
                "Seuls les superadmins peuvent créer des admins"
            )
        serializer.save(is_staff=True, is_superuser=False)


class CreateSuperAdminView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            raise permissions.PermissionDenied(
                "Seuls les superadmins peuvent créer des superadmins"
            )
        serializer.save(is_staff=True, is_superuser=True)


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            return Client.objects.all()
        return Client.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        client = self.get_object()
        if not self.request.user.is_superuser and client.user != self.request.user:
            raise PermissionDenied("Vous ne pouvez pas modifier ce client")
        if "user" in serializer.validated_data and not self.request.user.is_superuser:
            serializer.validated_data.pop("user")
        serializer.save()

    def perform_destroy(self, instance):
        if not self.request.user.is_superuser and instance.user != self.request.user:
            raise PermissionDenied("Vous ne pouvez pas supprimer ce client")
        instance.delete()


class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):  # contacts liés au admin
        user = self.request.user
        if user.is_superuser:
            return Contact.objects.all()
        return Contact.objects.filter(client__user=user)

    def perform_create(self, serializer):
        client_target = serializer.validated_data.get("client")
        if (
            client_target.user != self.request.user
            and not self.request.user.is_superuser
        ):
            raise ValidationError(
                {
                    "client": "Vous ne pouvez pas ajouter de contact à un client qui ne vous appartient pas."
                }
            )
        serializer.save()

    def perform_update(self, serializer):
        contact = self.get_object()
        if (
            not self.request.user.is_superuser
            and contact.client.user != self.request.user
        ):
            raise PermissionDenied("Vous n'avez pas le droit de modifier ce contact.")
        serializer.save()

    def perform_destroy(self, instance):
        if (
            not self.request.user.is_superuser
            and instance.client.user != self.request.user
        ):
            raise PermissionDenied("Vous n'avez pas le droit de supprimer ce contact.")
        instance.delete()


class InteractionViewSet(viewsets.ModelViewSet):
    serializer_class = InteractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_superuser:
            queryset = Interaction.objects.all()
        else:
            queryset = Interaction.objects.filter(client__user=user)
        client_id = self.request.query_params.get("client_id")
        if client_id:
            queryset = queryset.filter(client_id=client_id)

        return queryset

    def perform_create(self, serializer):
        client = serializer.validated_data.get("client")
        if not self.request.user.is_superuser and client.user != self.request.user:
            raise PermissionDenied(
                "Vous ne pouvez pas créer d'interaction pour un client qui ne vous appartient pas."
            )
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        interaction = self.get_object()
        if (
            not self.request.user.is_superuser
            and interaction.client.user != self.request.user
        ):
            raise PermissionDenied(
                "Vous n'avez pas le droit de modifier cette interaction."
            )
        serializer.save()

    def perform_destroy(self, instance):
        if (
            not self.request.user.is_superuser
            and instance.client.user != self.request.user
        ):
            raise PermissionDenied(
                "Vous n'avez pas le droit de supprimer cette interaction."
            )
        instance.delete()
