from django.contrib import admin
from django.urls import path, include
from . import views

urlpatterns = [
    path('', views.getRoutes),
    path('posts/', views.getPosts),
    path('posts/<uuid:uuid>', views.getPost),
    path('posts/createPost', views.createPost, name='create_post')
    
]
