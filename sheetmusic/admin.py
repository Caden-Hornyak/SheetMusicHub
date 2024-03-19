from django.contrib import admin
from .models import (Post, Image, Comment, Vote, SongNote,
                     Video, PDF, UserProfile, Song, Note)
# Register your models here.
admin.site.register(Post)
admin.site.register(UserProfile)
admin.site.register(Song)
admin.site.register(Image)
admin.site.register(Video)
admin.site.register(PDF)
admin.site.register(Comment)
admin.site.register(Vote)
admin.site.register(Note)
admin.site.register(SongNote)