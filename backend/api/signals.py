from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Client, EmailOTP, Notification
from django.utils.translation import gettext_lazy as _


@receiver(post_save, sender=User)
def ensure_email_otp(sender, instance, created, **kwargs):
    EmailOTP.objects.get_or_create(user=instance)


@receiver(pre_save, sender=Client)
def store_old_user(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Client.objects.get(pk=instance.pk)
            instance._old_user = old_instance.user
        except Client.DoesNotExist:
            instance._old_user = None
    else:
        instance._old_user = None


@receiver(post_save, sender=Client)
def manage_client_notifications(sender, instance, created, **kwargs):
    link_url = f"/tables/details-client/{instance.id}"
    notifs = []
    if created:
        admins = User.objects.filter(is_superuser=True)
        for admin in admins:
            if admin != instance.user:
                notifs.append(
                    Notification(
                        recipient=admin,
                        title=(_("Nouveau client")),
                        message=_("Le client '%(nom)s' a été ajouté par %(user)s.")
                        % {"nom": instance.nomClient, "user": instance.user.username},
                        link=link_url,
                    )
                )
    else:
        if hasattr(instance, "_old_user") and instance._old_user != instance.user:
            notifs.append(
                Notification(
                    recipient=instance.user,
                    title=(_("Client attribué")),
                    message=_("La gestion du client '%(nom)s' vous a été attribuée.")
                    % {"nom": instance.nomClient},
                    link=link_url,
                )
            )
            if instance._old_user:
                notifs.append(
                    Notification(
                        recipient=instance._old_user,
                        title=(_("Client Retiré")),
                        message=_(
                            "La gestion du client '%(nom)s' a été transférée à %(user)s."
                        )
                        % {"nom": instance.nomClient, "user": instance.user.username},
                        link=link_url,
                    )
                )
    if notifs:
        Notification.objects.bulk_create(notifs)
