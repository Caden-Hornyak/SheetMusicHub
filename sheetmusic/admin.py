from django.contrib import admin
from .models import Post, Image, Comment, Vote, Video, PDF
# Register your models here.
admin.site.register(Post)

admin.site.register(Image)
admin.site.register(Video)
admin.site.register(PDF)


admin.site.register(Comment)

admin.site.register(Vote)