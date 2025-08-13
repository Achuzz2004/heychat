import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Message, Chat

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        if isinstance(self.scope.get('user'), AnonymousUser):
            await self.close()
            return
        self.group_name = f"chat_{self.chat_id}"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data or '{}')
        t = data.get('type')
        if t == 'message':
            msg = await self._save_message(self.chat_id, self.scope['user'].id, data.get('cipher'))
            payload = {
                'type': 'message',
                'id': msg['id'],
                'chat_id': int(self.chat_id),
                'sender_id': msg['sender_id'],
                'cipher': msg['cipher'],
                'status': msg['status'],
                'created_at': msg['created_at'],
            }
            await self.channel_layer.group_send(self.group_name, { 'type': 'broadcast', 'event': payload })
        elif t == 'typing':
            await self.channel_layer.group_send(self.group_name, { 'type': 'broadcast', 'event': { 'type': 'typing', 'user_id': self.scope['user'].id } })

    async def broadcast(self, event):
        await self.send(text_data=json.dumps(event['event']))

    @database_sync_to_async
    def _save_message(self, chat_id, user_id, cipher):
        m = Message.objects.create(chat_id=chat_id, sender_id=user_id, cipher=cipher)
        return { 'id': m.id, 'sender_id': user_id, 'cipher': cipher, 'status': m.status, 'created_at': m.created_at.isoformat() }
