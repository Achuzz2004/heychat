from django.contrib import admin
from .models import Chat, Message, Attachment
admin.site.register(Chat)
admin.site.register(Message)
admin.site.register(Attachment)
