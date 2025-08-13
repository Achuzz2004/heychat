from django.urls import path
from .views import ContactsView, ChatMessagesView, UploadAttachmentView

urlpatterns = [
    path("contacts/", ContactsView.as_view()),
    path("chats/<int:chat_id>/messages/", ChatMessagesView.as_view()),
    path("messages/<int:message_id>/upload/", UploadAttachmentView.as_view()),
]
