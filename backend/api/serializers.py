from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Client, Contact, Interaction

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password", "is_staff", "is_superuser"]
        extra_kwargs = {
            "password": {"write_only": True},
            "is_staff": {"default": True},
            "is_superuser": {"default": False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = "__all__"

class ClientSerializer(serializers.ModelSerializer):
    contacts = ContactSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = [
            "id",
            "typeClient",
            "nomClient",
            "dateCreationClient",
            "user",
            "contacts",
        ] # contactes est un champ virtuel pour assusrer one to many sinon si __all__ il recupere juste ID.
        extra_kwargs = {"user": {"read_only": True}}

class InteractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interaction
        fields = "__all__"
        extra_kwargs = {"user": {"read_only": True}}
