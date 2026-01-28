from django.utils import timezone
from django.db import models
from django.contrib.auth.models import User
from django.utils.translation import gettext_lazy as _
import datetime


class EmailOTP(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="emailotp")
    otp_code = models.CharField(max_length=6, blank=True, null=True)
    otp_created_at = models.DateTimeField(blank=True, null=True)
    attempts = models.IntegerField(default=0)

    def __str__(self):
        return self.user.username

    def is_otp_valid(self):
        if not self.otp_created_at:
            return False
        return (timezone.now() - self.otp_created_at) < datetime.timedelta(minutes=5)


class Client(models.Model):
    TYPE_CLIENT = [
        ("PARTICULIER", _("Particulier")),
        ("ENTREPRISE", _("Entreprise")),
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
        ("APPEL", _("Appel Téléphonique")),
        ("EMAIL", _("Email")),
        ("REUNION", _("Réunion")),
        ("AUTRE", _("Autre")),
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


class Notification(models.Model):
    recipient = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="notifications"
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    link = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Notif pour {self.recipient}: {self.title}"


class Task(models.Model):
    STATUS_CHOICES = [
        ("TODO", _("À faire")),
        ("IN_PROGRESS", _("En cours")),
        ("DONE", _("Terminée")),
    ]
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="TODO")

    assigned_to = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="tasks"
    )
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="created_tasks"
    )

    def __str__(self):
        return self.title
