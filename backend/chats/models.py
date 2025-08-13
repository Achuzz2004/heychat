from django.db import models
from django.contrib.auth.models import User

class Chat(models.Model):
    # Two-party chat
    a = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_a")
    b = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats_b")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("a", "b")

class Message(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    # Store ciphertext only for E2EE
    cipher = models.JSONField()
    status = models.CharField(max_length=12, default="sent")  # sent|delivered|seen
    created_at = models.DateTimeField(auto_now_add=True)
    deleted_for = models.ManyToManyField(User, related_name="deleted_messages", blank=True)

class Attachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name="attachments")
    file = models.FileField(upload_to="attachments/")
    mime = models.CharField(max_length=120)
    size = models.IntegerField(default=0)
