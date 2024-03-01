from rest_framework.serializers import ModelSerializer
from .models import Post, SheetMusicImage


class SheetMusicImageSerializer(ModelSerializer):
    class Meta:
        model = SheetMusicImage
        fields = '__all__'

class PostSerializer(ModelSerializer):
    images = SheetMusicImageSerializer(many=True)
    class Meta:
        model = Post
        fields = '__all__'
