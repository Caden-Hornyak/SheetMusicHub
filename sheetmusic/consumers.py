from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room
import json
from asgiref.sync import async_to_sync
import sys

class RoomConsumer(WebsocketConsumer):
    def connect(self):
        self.accept()

        room_code = self.scope['url_route']['kwargs'].get('url_input')
            
        self.room_group_name = 'test'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, 
            self.channel_name
        )

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected!'
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
