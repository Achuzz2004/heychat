from rest_framework import serializers
from .models import Chat, Message, Attachment

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = ["id", "file", "mime", "size"]

class MessageSerializer(serializers.ModelSerializer):
    attachments = AttachmentSerializer(many=True, read_only=True)
    sender_id = serializers.IntegerField(source="sender.id", read_only=True)
    chat_id = serializers.IntegerField(source="chat.id", read_only=True)

    class Meta:
        model = Message
        fields = ["id", "chat_id", "sender_id", "cipher", "status", "created_at", "attachments"]

class ChatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ["id", "a", "b", "created_at"]
