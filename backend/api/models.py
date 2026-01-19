from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User


class Client(models.Model):
    TYPE_CLIENT = [
        ("PARTICULIER", "Particulier"),
        ("ENTREPRISE", "Entreprise"),
    ]

    typeClient = models.CharField(max_length=20, choices=TYPE_CLIENT)
    nomClient = models.CharField(max_length=100)
    dateCreationClient = models.DateField(auto_now_add=True)
    # Un user peut créer plusieurs clients
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="clients")

    def __str__(self):
        return self.nomClient


class Contact(models.Model):
    nomContact = models.CharField(max_length=100)
    prenomContact = models.CharField(max_length=100)
    emailContact = models.EmailField()
    telContact = models.CharField(max_length=20)
    adresseContact = models.TextField()
    posteContact = models.CharField(max_length=100)
    # un client peut avoir plusieurs contacts
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="contacts"
    )

    def __str__(self):
        return f"{self.prenomContact} {self.nomContact}"


class Interaction(models.Model):
    TYPE_INTERACTION = [
        ("APPEL", "Appel Téléphonique"),
        ("EMAIL", "Email"),
        ("REUNION", "Réunion"),
        ("AUTRE", "Autre"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    client = models.ForeignKey(
        Client, on_delete=models.CASCADE, related_name="interactions"
    )
    dateInteraction = models.DateTimeField(default=timezone.now)
    typeInteraction = models.CharField(max_length=20, choices=TYPE_INTERACTION)
    commInteraction = models.TextField()

    def __str__(self):
        return f"{self.typeInteraction} - {self.client.nomClient}"
