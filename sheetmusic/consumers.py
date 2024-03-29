from channels.generic.websocket import WebsocketConsumer
from channels.db import database_sync_to_async
from .models import Room
import json

class RoomConsumer(WebsocketConsumer):
    def connect(self):
        # self.room_code = self.scope['url_route']['kwargs']['room_code']
        # await self.channel_layer.group_add(self.room_code, self.channel_name)
        # await self.accept()
        self.accept()

        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'You are now connected!'
        }))

    # async def disconnect(self, close_code):
    #     await self.channel_layer.group_discard(self.room_code, self.channel_name)

    # @database_sync_to_async
    # def get_room(self, room_code):
    #     return Room.objects.get(code=room_code)

    # async def receive(self, text_data):
    #     # Handle received messages
    #     pass



# class NoteConsumer(AsyncWebsocketConsumer):
#     async def connect(self):
#         self.room_code = self.scope['url_route']['kwargs']['room_code']
#         self.room_group_name = f'room_{self.room_code}'
#         await self.channel_layer.group_add(self.room_group_name, self.channel_name)
#         await self.accept()

#     async def disconnect(self, close_code):
#         await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

#     async def receive(self, text_data):
#         # Handle received notes and broadcast to room group
#         await self.channel_layer.group_send(
#             self.room_group_name,
#             {
#                 'type': 'note_message',
#                 'note': text_data
#             }
#         )

#     async def note_message(self, event):
#         note = event['note']
#         # Handle received note and send to connected clients
#         await self.send(text_data=note)