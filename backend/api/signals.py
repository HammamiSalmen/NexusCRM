from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import Client, Notification


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
                        title="Nouveau Client",
                        message=f"Le client '{instance.nomClient}' a été ajouté par {instance.user.username}.",
                        link=link_url,
                    )
                )

    else:
        if hasattr(instance, "_old_user") and instance._old_user != instance.user:
            notifs.append(
                Notification(
                    recipient=instance.user,
                    title="Client Attribué",
                    message=f"La gestion du client '{instance.nomClient}' vous a été attribuée.",
                    link=link_url,
                )
            )

            if instance._old_user:
                notifs.append(
                    Notification(
                        recipient=instance._old_user,
                        title="Client Retiré",
                        message=f"La gestion du client '{instance.nomClient}' a été transférée à {instance.user.username}.",
                        link=link_url,
                    )
                )

    if notifs:
        Notification.objects.bulk_create(notifs)
