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
        """
        L'utilisateur ne voit que les contacts des clients qu'il a créés.
        """
        user = self.request.user
        if user.is_superuser:
            return Contact.objects.all()
        # Filtre magique : on remonte la relation FK vers client -> user
        return Contact.objects.filter(client__user=user)

    def perform_create(self, serializer):
        """
        Sécurité CRITIQUE : Vérifier que le client auquel on attache ce contact
        appartient bien à l'utilisateur connecté.
        """
        # On récupère l'objet Client envoyé dans le JSON (ex: "client": 12)
        client_target = serializer.validated_data.get("client")

        # Si l'utilisateur n'est pas le propriétaire du client (et pas admin)
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
        # Note : Pour update et destroy, get_queryset filtre déjà les contacts.
        # Si un utilisateur essaie de modifier un contact ID 5 qui ne lui appartient pas,
        # get_queryset renverra 404 Not Found, donc c'est sécurisé par défaut.


class InteractionViewSet(viewsets.ModelViewSet):
    serializer_class = InteractionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Interaction.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
