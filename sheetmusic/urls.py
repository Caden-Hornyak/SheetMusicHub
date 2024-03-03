from django.contrib import admin
from django.urls import path, include
from . import views
from .views import LoginView, GetCSRFToken, CheckAuthenticatedView, RegisterView, LogoutView, Posts, UserProfiles

urlpatterns = [
    
    path('', views.getRoutes),
    path('posts/create-post/', Posts.as_view(), name='create_post'),
    path('posts/<str:type>/', Posts.as_view(), name='posts'),

    
    path('accounts/register/', RegisterView.as_view()),
    path('accounts/csrf_cookie/', GetCSRFToken.as_view()),
    path('accounts/check-authenticated/', CheckAuthenticatedView.as_view()),
    path('accounts/logout/', LogoutView.as_view()),
    path('accounts/login/', LoginView.as_view()),

    path('profile/get-profile/', UserProfiles.as_view()),
    path('profile/update-profile/', UserProfiles.as_view())
    
    
]
