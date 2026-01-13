from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, viewsets, permissions
from .serializers import (
    UserSerializer,
    ClientSerializer,
    ContactSerializer,
    InteractionSerializer,
)
from .models import Client, Contact, Interaction


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
            raise permissions.PermissionDenied("Seuls les superadmins peuvent créer des admins")

        serializer.save(is_staff=True, is_superuser=False)


class CreateSuperAdminView(generics.CreateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        if not self.request.user.is_superuser:
            raise permissions.PermissionDenied("Seuls les superadmins peuvent créer des superadmins")

        serializer.save(is_staff=True, is_superuser=True)


class ClientViewSet(viewsets.ModelViewSet):
    serializer_class = ClientSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # admin voit les clients qu'il a crées seulement
        return Client.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # assignation d'un client a un admin
        serializer.save(user=self.request.user)

class ContactViewSet(viewsets.ModelViewSet):
    serializer_class = ContactSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # contacts liés au admin
        return Contact.objects.filter(client__user=self.request.user)

class InteractionViewSet(viewsets.ModelViewSet):
    serializer_class = InteractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Interaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
