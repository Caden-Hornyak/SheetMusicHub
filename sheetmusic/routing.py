from django.urls import re_path
from .import consumers

websocket_urlpatterns = [
    re_path(r'ws/socket-server/(?P<roomcode>[\w-]+)/$', consumers.RoomConsumer.as_asgi()),
    re_path(r'ws/socket-server/', consumers.RoomConsumer.as_asgi())
]