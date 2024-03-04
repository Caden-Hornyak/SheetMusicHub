from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from .serializers import (PostSerializerSingle, PostSerializerMultiple, 
                          UserProfileSerializer, CommentSerializer)
from .models import (Post, SheetMusicImage, UserProfile, 
                     Comment)
from django.http import JsonResponse
from rest_framework import status
import sys
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
import django.contrib.auth as auth
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from django.contrib.auth.decorators import login_required


import fitz
from PIL import Image


# Create your views here.

@api_view(['GET'])
def getRoutes(request):

    routes = [
        {
            'Endpoint': '/notes/',
            'method': 'GET',
            'body': None,
            'description': 'Returns an array of notes'
        },
        {
            'Endpoint': '/notes/id',
            'method': 'GET',
            'body': None,
            'description': 'Returns a single note object'
        },
        {
            'Endpoint': '/notes/create/',
            'method': 'POST',
            'body': {'body': ""},
            'description': 'Creates new note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/update/',
            'method': 'PUT',
            'body': {'body': ""},
            'description': 'Creates an existing note with data sent in post request'
        },
        {
            'Endpoint': '/notes/id/delete/',
            'method': 'DELETE',
            'body': None,
            'description': 'Deletes and exiting note'
        },
    ]
    return Response(routes)

class Posts(APIView):
    permission_classes = (permissions.AllowAny, )
    # create post

    # @method_decorator(csrf_protect, name='dispatch')
    # @method_decorator(login_required)
    @method_decorator(csrf_exempt)
    def post(self, request, format=None):

        pdf_file = request.FILES.get('pdf_file')
        
        # if pdf file exists and is readable
        if pdf_file and isinstance(pdf_file, InMemoryUploadedFile):

            file_path = os.path.join(settings.MEDIA_ROOT, "pdfs", pdf_file.name)

            # save pdf
            with open(file_path, 'wb+') as destination:
                for chunk in pdf_file.chunks():
                    destination.write(chunk)
                saved_file_name =  file_path

            # Create Post without images
            post = Post()
            post.title = request.data.get('title', '')
            post.pdf_file = saved_file_name 
            post.save()
            
            # Pymupdf variables
            zoom = 2 # resolution
            mat = fitz.Matrix(zoom, zoom)

            pdf_document = fitz.open(post.pdf_file)
            for page_number in range(pdf_document.page_count):
                # Get and convert page
                page = pdf_document[page_number]
                pixmap = page.get_pixmap() 

                # Save page
                image_filename = os.path.join(settings.MEDIA_ROOT, "images", f'{pdf_file.name}-%i.png' % page.number)
                image_file = pixmap.save(image_filename)

                # update post
                new_image = SheetMusicImage(image=image_filename)
                
                new_image.save()
                post.images.add(new_image)
                
            post.save()
            pdf_document.close()


            return Response({'success': 'Post created successfully', 'id': post.id})
        
        return Response({'error': 'No file provided'}, status=400)
    
    # get posts
    def get(self, request, type, format=None):

        if type == 'multiple':
            serializer = PostSerializerMultiple(Post.objects.all(), many=True)
        else:
            try:
                serializer = PostSerializerSingle(Post.objects.get(id=type))
                # print(serializer.data, file=sys.stderr)
            except Exception as e:
                print(e, file=sys.stderr)
                return Response({ 'error': 'Post does not exist'})
            

        return Response(serializer.data)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']
        re_password = data['re_password']

        if password == re_password:
            if User.objects.filter(username=username).exists():
                return Response({ 'error': 'Username already exists '})
            elif len(password) < 6:
                return Response({ 'error': 'Password is less than 6 characters '})
            else:
                user = User.objects.create_user(username=username, password=password)

                user_profile = UserProfile.objects.create(user=user, first_name='', last_name='')

                return Response({ 'success': 'Account Created'})
        else:
            return Response({ 'error': 'Passwords do not match'})
        
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set'})

class CheckAuthenticatedView(APIView):

    def get(self, request, format=None):

        try:
            user = self.request.user

            isAuthenticated = User.is_authenticated

            if isAuthenticated:
                return Response({ 'success': 'User Authenticated'})
            else:
                return Response({ 'error': 'User Not Authenticated'})
        except:
            return Response({ 'error': 'User Not Authenticated'})

@method_decorator(ensure_csrf_cookie, name='dispatch') 
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return Response({ 'success': 'User Authenticated'})
        else:
            return Response({ 'error', 'Error Authenticating User'})
        
class LogoutView(APIView):
    def post(self, request, format=None):
        auth.logout(request)
        return Response({ 'success': 'Successfully logged out'})
    
class DeleteAccountView(APIView):

    def delete(self, request, format=None):
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()

            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'User was not deleted successfully' })

class UserProfiles(APIView):
    def get(self, request, format=None):
        try: 
            user = self.request.user
            user_profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(user_profile)

            return Response({ 'profile': serializer.data, 'username': user.username})
        except:
            return Response({ 'error': "Something went wrong displaying User Profile."})
        
    def put(self, request, format=None):
        try:
            user = self.request.user
            username= user.username

            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']

            UserProfile.objects.filter(user=user).update(first_name=first_name, last_name=last_name)

            user_profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(user_profile)

            return Response({ 'profile ': serializer.data })
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({ 'error': 'There was an error updating the user profile.'})



