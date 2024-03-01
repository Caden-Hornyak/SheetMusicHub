from django.contrib import admin
from django.urls import path, include
from . import views
from .views import LoginView, GetCSRFToken, CheckAuthenticatedView, RegisterView, LogoutView, Posts

urlpatterns = [
    path('accounts/login/', LoginView.as_view()),
    path('', views.getRoutes),
    path('posts/', Posts.as_view(), name='posts'),
    path('posts/create-post/', Posts.as_view(), name='create_post'),
    
    path('accounts/register/', RegisterView.as_view()),
    path('accounts/csrf_cookie/', GetCSRFToken.as_view()),
    path('accounts/check_authenticated/', CheckAuthenticatedView.as_view()),
    path('accounts/logout/', LogoutView.as_view()),

    
    
]
