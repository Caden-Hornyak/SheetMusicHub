from django.db import models
from django.contrib.auth.models import User
import uuid


class SheetMusicImage(models.Model):
    image = models.ImageField(upload_to='images/')

# Create your models here.
class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=50)

    likes = models.IntegerField(default=0)
    comment_count = models.IntegerField(default=0)

    pdf_file = models.FileField(upload_to='pdfs/')
    images = models.ManyToManyField(SheetMusicImage, blank=True)
    
    comments = models.ManyToManyField('Comment', blank=True)
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.pdf_file.name

class Comment(models.Model):
    text = models.CharField(max_length=500)
    child_comment = models.ManyToManyField('self', blank=True)
    is_deleted = models.BooleanField(default=False)
    date_created = models.DateTimeField(auto_now_add=True)

    def delete(self, using=None, keep_parents=False):
        # Instead of actually deleting the comment, just mark it as deleted
        self.is_deleted = True
        self.save()

    def __str__(self):
        return self.text

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=255, default='')
    last_name = models.CharField(max_length=255, default='')

    def __str__(self):
        return self.user.username
