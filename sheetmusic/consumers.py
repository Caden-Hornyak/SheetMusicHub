from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room
import json
from asgiref.sync import async_to_sync
import sys
import random

class RoomConsumer(WebsocketConsumer):
    def connect(self):

        room_code = self.scope['url_route']['kwargs'].get('url_input')
        
        
        if room_code:
            self.room_group_name = room_code
        else:
            room_code_chars = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM'
            self.room_group_name = ''.join(
            [room_code_chars[random.randint(0, len(room_code_chars))] for i in range(6)])
        

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, 
            self.channel_name
        )

        self.accept()

        # Send additional data to the client after accepting the connection
        self.send(text_data=json.dumps({
            'room_code': self.room_group_name
        }))

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):

        text_data_json = json.loads(text_data)
        
        note = text_data_json['note']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'handle_note',
                'note': note
            }
        )

    def handle_note(self, event):
        note = event['note']

        self.send(text_data=json.dumps({
            'type': 'note',
            'note': note
        }))
