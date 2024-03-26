from django.db import models
from django.contrib.auth.models import User
import uuid


class Image(models.Model):
    file = models.ImageField(upload_to='images/')
    name = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name
    
class Video(models.Model):
    file = models.FileField(upload_to='videos/')
    name = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class PDF(models.Model):
    file = models.FileField(upload_to='pdfs/')
    name = models.CharField(max_length=50, blank=True)
    order = models.IntegerField(default=0)

    def __str__(self):
        return self.name

# Create your models here.
class Post(models.Model):
    poster = models.ForeignKey('UserProfile', on_delete=models.SET_NULL, null=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)

    likes = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)

    pdf_files = models.ManyToManyField('Pdf', blank=True)
    images = models.ManyToManyField('Image', blank=True)
    videos = models.ManyToManyField('Video', blank=True)
    description = models.TextField(default='')
    
    comments = models.ManyToManyField('Comment', blank=True)
    date_created = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.title

class Comment(models.Model):
    poster = models.ForeignKey('UserProfile', on_delete=models.CASCADE, null=True)
    parent_post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True)
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    text = models.CharField(max_length=500)
    child_comment = models.ManyToManyField('self', blank=True, symmetrical=False)
    is_deleted = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)

    # def delete(self, using=None, keep_parents=False):
    #     # Instead of actually deleting the comment, just mark it as deleted
    #     self.is_deleted = True
    #     self.save()

    def __str__(self):
        return self.text

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, default='')
    last_name = models.CharField(max_length=255, default='')
    posts = models.ManyToManyField('Post', blank=True, related_name='created_post')
    songs = models.ManyToManyField('Song', blank=True)
    profile_picture = models.ImageField(upload_to='images/', default='default_profpic')

    def __str__(self):
        return str(self.user)
    
class Vote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey('UserProfile', on_delete=models.CASCADE, null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True)
    value = models.IntegerField(default=0)

    def __str__(self):
        return str(self.user)
    
class Song(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    notes = models.ManyToManyField('Note', through='SongNote', blank=True)

    def __str__(self):
        return self.name

class Note(models.Model):
    note = models.CharField(max_length=500)
    start_timestamp = models.IntegerField(default=0)
    end_timestamp = models.IntegerField(default=0)

    def __str__(self):
        return self.note + str(self.start_timestamp)
    
class SongNote(models.Model):
    song = models.ForeignKey('Song', on_delete=models.CASCADE)
    note = models.ForeignKey('Note', on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    class Meta:
        ordering = ['order']

class Bookmark(models.Model):
    user = models.ForeignKey('UserProfile', on_delete=models.CASCADE)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, null=True)
    post = models.ForeignKey('Post', on_delete=models.CASCADE, null=True)

    def __str__(self):
        obj = ''
        if self.comment:
            obj = str(self.comment)
        elif self.post:
            obj = str(self.post)

        return str(self.user) + ' ' + obj

