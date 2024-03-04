from rest_framework.serializers import ModelSerializer
from .models import Post, SheetMusicImage, UserProfile, Comment
from rest_framework import serializers
import sys

class SheetMusicImageSerializer(ModelSerializer):
    class Meta:
        model = SheetMusicImage
        fields = '__all__'

class PostSerializerMultiple(ModelSerializer):
    images = SheetMusicImageSerializer(many=True)
    class Meta:
        model = Post
        fields = ('id', 'title', 'likes', 'comment_count', 'images', 'comments', 'date_created')

class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class CommentSerializer(ModelSerializer):
    child_comment = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_child_comment(self, obj):
        # Recursive serialization for child comments
        child_comment = obj.child_comment.all()
        serializer = CommentSerializer(child_comment, many=True)
        return serializer.data
    
class PostSerializerSingle(ModelSerializer):
    images = SheetMusicImageSerializer(many=True)
    comments = CommentSerializer(many=True)

    class Meta:
        model = Post
        fields = '__all__'