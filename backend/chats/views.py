from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.contrib.auth.models import User
from .models import Chat, Message, Attachment
from .serializers import MessageSerializer
from django.db.models import Q

class ContactsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        # List users the requester has chats with
        user = request.user
        chats = Chat.objects.filter(Q(a=user)|Q(b=user)).select_related("a","b")
        contacts = []
        for c in chats:
            other = c.a if c.b == user else c.b
            last = c.messages.order_by("-created_at").first()
            contacts.append({
                "id": str(other.id),
                "username": other.profile.username if hasattr(other, "profile") else other.username,
                "avatar_url": other.profile.avatar.url if hasattr(other, "profile") and other.profile.avatar else None,
                "last_message": None if not last else "cipher",  # client decrypts
                "last_time": last.created_at.isoformat() if last else None,
            })
        return Response(contacts)

class ChatMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, chat_id: int):
        limit = int(request.query_params.get("limit", 50))
        qs = Message.objects.filter(chat_id=chat_id).order_by("-created_at")[:limit]
        data = MessageSerializer(qs, many=True).data
        return Response({"results": data[::-1]})

    def post(self, request, chat_id: int):
        m = Message.objects.create(chat_id=chat_id, sender=request.user, cipher=request.data.get("cipher"))
        return Response(MessageSerializer(m).data, status=201)

class UploadAttachmentView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, message_id: int):
        f = request.FILES.get("file")
        if not f:
            return Response({"detail":"file required"}, status=400)
        a = Attachment.objects.create(message_id=message_id, file=f, mime=f.content_type or "application/octet-stream", size=f.size)
        return Response({"id": a.id, "file": a.file.url, "mime": a.mime, "size": a.size})
