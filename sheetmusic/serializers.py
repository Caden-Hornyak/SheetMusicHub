from rest_framework.serializers import ModelSerializer
from .models import Post, SheetMusicImage, UserProfile, Comment, Vote, User
from rest_framework import serializers
import sys


class SheetMusicImageSerializer(ModelSerializer):
    class Meta:
        model = SheetMusicImage
        fields = '__all__'

class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class CommentSerializer(ModelSerializer):
    child_comment = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    poster = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = '__all__'

    # Recursive serialization for child comments
    def get_child_comment(self, obj):
        
        child_comment = obj.child_comment.all()
        serializer = CommentSerializer(child_comment, many=True, context={'request': self.context.get('request') })
        return serializer.data
    
    # user_vote = previous user votes on comment
    def get_user_vote(self, obj):
        try:
            # Get the current user from the request
            username = self.context.get('request').user
            user = User.objects.get(username=username)
            user_prof = UserProfile.objects.get(user=user)

            # Check if a vote exists for the current user and comment
            vote = Vote.objects.get(user=user_prof, comment=obj)
            return vote.value
        except Vote.DoesNotExist:
            return 0
        
    def get_poster(self, obj):
        if obj.poster:
            return obj.poster.user.username
        else:
            return "User Not Found"
        

class PostSerializerMultiple(ModelSerializer):
    images = SheetMusicImageSerializer(many=True)
    class Meta:
        model = Post
        fields = ('id', 'title', 'likes', 'comment_count', 'images', 'comments', 'date_created')

class PostSerializerSingle(ModelSerializer):
    user_vote = serializers.SerializerMethodField()
    images = SheetMusicImageSerializer(many=True)
    comments = serializers.SerializerMethodField()
    poster = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = '__all__'

    def get_comments(self, obj):
        comments = obj.comments.all()
        serializer = CommentSerializer(comments, many=True, context={'request': self.context.get('request') })
        return serializer.data
    
    # user_vote = previous user votes on post
    def get_user_vote(self, obj):
        try:
            # Get the current user from the request
            username = self.context.get('request').user
            user = User.objects.get(username=username)
            user_prof = UserProfile.objects.get(user=user)

            # Check if a vote exists for the current user and comment
            vote = Vote.objects.get(user=user_prof, post=obj)
            return vote.value
        except Exception as e:
            print(e, file=sys.stderr)
            return 0
        
    def get_poster(self, obj):
        if obj.poster:
            return obj.poster.user.username
        else:
            return "User Not Found"

    
