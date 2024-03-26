from rest_framework.serializers import ModelSerializer
from .models import (Post, Image, UserProfile, Comment, 
                     Vote, User, Video, PDF, Song, Note,
                     SongNote, Bookmark)
from rest_framework import serializers
import sys


class ImageSerializer(ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = Image
        fields = '__all__'

    def get_type(self, obj):
        return 'image'

class PDFSerializer(ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = PDF
        fields = '__all__'

    def get_type(self, obj):
        return 'pdf'

class VideoSerializer(ModelSerializer):
    type = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = '__all__'

    def get_type(self, obj):
        return 'video'

class UserProfileSerializer(ModelSerializer):
    class Meta:
        model = UserProfile
        fields = '__all__'

class UserProfilePublicSerializer(ModelSerializer):
    username = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ('id', 'username', 'profile_picture')

    def get_username(self, obj):
        if obj.user:
            return obj.user.username
        else:
            return 'User not Found'

class CommentSerializer(ModelSerializer):

    child_comment = serializers.SerializerMethodField()
    user_vote = serializers.SerializerMethodField()
    poster = UserProfilePublicSerializer()
    user_bookmark = serializers.SerializerMethodField()

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
        except Exception as e:
            return 0
        
        
    def get_user_bookmark(self, obj):
        user_prof = UserProfile.objects.get(user=self.context.get('request').user)
        return Bookmark.objects.filter(user=user_prof, comment=obj).exists()
        
class CommentNoChildrenSerializer(ModelSerializer):
    parent_post = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'text', 'date_created', 'likes', 'parent_post')
 

class PostSerializerMultiple(ModelSerializer):
    user_vote = serializers.SerializerMethodField()
    user_bookmark = serializers.SerializerMethodField()
    images = ImageSerializer(many=True)
    pdf_files = PDFSerializer(many=True)
    videos = VideoSerializer(many=True)
    poster = UserProfilePublicSerializer()

    class Meta:
        model = Post
        fields = ('id', 'title', 'likes', 'comment_count', 'images', 'pdf_files',
                   'videos', 'comments', 'date_created', 'poster', 'description', 'user_vote', 'user_bookmark')

        
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
            return 0
        
    def get_user_bookmark(self, obj):
        user_prof = UserProfile.objects.get(user=self.context.get('request').user)
        return Bookmark.objects.filter(user=user_prof, post=obj).exists()

class PostSerializerSingle(ModelSerializer):
    user_vote = serializers.SerializerMethodField()
    user_bookmark = serializers.SerializerMethodField()
    images = ImageSerializer(many=True)
    videos = VideoSerializer(many=True)
    pdf_files = PDFSerializer(many=True)
    comments = serializers.SerializerMethodField()
    poster = UserProfilePublicSerializer()

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
            return 0
        
        
    def get_user_bookmark(self, obj):
        user_prof = UserProfile.objects.get(user=self.context.get('request').user)
        return Bookmark.objects.filter(user=user_prof, post=obj).exists()
        

class NoteSerializer(ModelSerializer):
    class Meta:
        model = Note
        fields = '__all__'

class SongNoteSerializer(ModelSerializer):
    note = NoteSerializer()

    class Meta:
        model = SongNote
        fields = ('note', 'order')

class SongSerializer(ModelSerializer):
    song_notes = SongNoteSerializer(source='songnote_set', many=True)
    
    class Meta:
        model = Song
        fields = ('name', 'song_notes', 'id')


    
