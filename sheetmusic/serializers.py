from rest_framework.serializers import ModelSerializer
from .models import Post, SheetMusicImage, UserProfile, Comment, Vote
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
    user_vote = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    def get_child_comment(self, obj):
        # Recursive serialization for child comments
        child_comment = obj.child_comment.all()
        serializer = CommentSerializer(child_comment, many=True)
        return serializer.data
    
    def get_user_vote(self, obj):
        # Get the current user from the request
        print(self.context, file=sys.stderr)
        user = self.context['request'].user

        # Check if a vote exists for the current user and comment
        try:
            vote = Vote.objects.get(user=user, comment=obj)
            return vote.value
        except Vote.DoesNotExist:
            return 0
    
class PostSerializerSingle(ModelSerializer):
    images = SheetMusicImageSerializer(many=True)
    comments = CommentSerializer(many=True)

    class Meta:
        model = Post
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # We pass the "upper serializer" context to the "nested one"
        self.field['request'].context.update(self.context)