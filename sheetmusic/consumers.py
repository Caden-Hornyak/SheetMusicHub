from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room
import json
from asgiref.sync import async_to_sync
import sys
import random
from .models import Room

class RoomConsumer(WebsocketConsumer):
    def connect(self):

        self.accept()
        self.scope['session']['room_id'] = 'your_room_id'
        self.scope['session'].save()

        room_code = self.scope['url_route']['kwargs'].get('roomcode')

        if room_code:
            room = Room.objects.filter(room_code=room_code).first()
            print(room, room_code, file=sys.stderr)
            if room:
                self.room_group_name = room_code
                room.user_count += 1
                room.save()
            else:
                return self.send(text_data=json.dumps({
                    'Error': 'Room does not exist'
                }))
        else:
            room_code_chars = '1234567890QWERTYUIOPASDFGHJKLZXCVBNM'
            while True:
                self.room_group_name = ''.join(
                [room_code_chars[random.randint(0, len(room_code_chars)-1)] for i in range(6)])
                print(self.room_group_name, not Room.objects.filter(room_code=self.room_group_name), file=sys.stderr)
                if not Room.objects.filter(room_code=self.room_group_name):
                    Room.objects.create(room_code=self.room_group_name, user_count=1)
                    break

                

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name, 
            self.channel_name
        )

        # Send additional data to the client after accepting the connection
        self.send(text_data=json.dumps({
            'room_code': self.room_group_name
        }))

    def disconnect(self, close_code):
        room_id = self.scope['session'].get('room_id')
        if room_id:
            room = Room.objects.get(id=room_id)
            if room.user_count == 1:
                room.delete()
            else:
                room.user_count -= 1
                room.save()

    def receive(self, text_data):

        text_data_json = json.loads(text_data)
        
        note = text_data_json['note']
        key_state = text_data_json['key_state']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'handle_note',
                'note': note,
                'key_state': key_state,
                'channel_name': self.channel_name
            }
        )

    def handle_note(self, event):
        note = event['note']
        key_state = event['key_state']
        if (event['channel_name'] != self.channel_name):
            self.send(text_data=json.dumps({
            'type': 'note',
            'note': note,
            'key_state': key_state
            }))
        
