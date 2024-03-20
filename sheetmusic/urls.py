from django.contrib import admin
from django.urls import path, include
from . import views
from .views import (LoginView, GetCSRFToken, CheckAuthenticatedView, 
                    RegisterView, LogoutView, Posts, UserProfiles, Votes, Comments, Songs)

urlpatterns = [
    path('posts/create-post/', Posts.as_view(), name='create_post'),
    path('posts/<str:id>/', Posts.as_view(), name='posts'),

    
    path('accounts/register/<str:type>', RegisterView.as_view()),
    path('accounts/csrf_cookie/', GetCSRFToken.as_view()),
    path('accounts/check-authenticated/', CheckAuthenticatedView.as_view()),
    path('accounts/logout/', LogoutView.as_view()),
    path('accounts/login/<str:type>', LoginView.as_view()),

    path('profile/get-profile/', UserProfiles.as_view()),
    path('profile/update-profile/', UserProfiles.as_view()),

    path('votes/<str:object_type>/<str:id>', Votes.as_view()),

    path('comments/create-comment/', Comments.as_view()),
    path('comments/<str:id>/', Comments.as_view()),
    path('songs/create-song', Songs.as_view()),

    path('songs/<str:id>', Songs.as_view()),
]
