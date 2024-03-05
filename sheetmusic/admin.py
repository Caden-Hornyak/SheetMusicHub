from django.contrib import admin
from .models import Post, SheetMusicImage, Comment, Vote
# Register your models here.
admin.site.register(Post)

admin.site.register(SheetMusicImage)

admin.site.register(Comment)

admin.site.register(Vote)