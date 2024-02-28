from django.contrib import admin
from django.urls import path, include
from . import views
from .views import LoginView, GetCSRFToken, CheckAuthenticatedView, RegisterView, LogoutView, PostAction

urlpatterns = [
    path('', views.getRoutes),
    path('posts/', views.getPosts),
    path('posts/<uuid:uuid>/', views.getPost),
    path('posts/create-post/', PostAction.as_view(), name='create_post'),

    path('accounts/register/', RegisterView.as_view()),
    path('csrf_cookie/', GetCSRFToken.as_view()),
    path('accounts/check_authenticated/', CheckAuthenticatedView.as_view()),
    path('login/', LoginView.as_view()),
    path('logout/', LogoutView.as_view()),

    
    
]
