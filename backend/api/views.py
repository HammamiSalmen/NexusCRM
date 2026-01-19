from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions
from rest_framework.exceptions import PermissionDenied, ValidationError
from .serializers import (
    UserSerializer,
    ClientSerializer,
    ContactSerializer,
    InteractionSerializer,
)
from .models import Client, Contact, Interaction


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


class UserListView(generics.ListAPIView):
    queryset = User.objects.all().order_by("-date_joined")
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated, IsSuperUser]


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
        if (
            not self.request.user.is_superuser
            and self.get_object().user != self.request.user
        ):
            raise PermissionDenied("Vous ne pouvez pas modifier ce client")
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
