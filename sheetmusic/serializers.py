from rest_framework.serializers import ModelSerializer
from .models import post

class PostSerializer(ModelSerializer):
    class Meta:
        model = post
        fields ='__all__'