from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from .serializers import MultiplePostSerializer, SinglePostSerializer
from .models import Post, SheetMusicImage, UserProfile
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

@api_view(['GET'])
def getPosts(request):
    posts = Post.objects.all().order_by('-likes')[:50]
    serializer = MultiplePostSerializer(posts, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def getPost(request, uuid):
    post = get_object_or_404(Post, id=uuid)
    serializer = SinglePostSerializer(post, many=True)

    return Response(serializer.data)


def save_uploaded_file(uploaded_file, target_path):
    # Generate a unique filename or use existing logic to determine the filename
    # Here, I am using the original filename, but you might want to add some logic to prevent overwriting
    file_name = uploaded_file.name

    with open(target_path, 'wb+') as destination:
        for chunk in uploaded_file.chunks():
            destination.write(chunk)
        return target_path

@method_decorator(csrf_protect, name='dispatch')
class PostAction(APIView):

    # create post
    @method_decorator(login_required)
    def post(self, request, format=None):

        pdf_file = request.FILES.get('pdf_file')
        
        # if pdf file exists and is readable
        if pdf_file and isinstance(pdf_file, InMemoryUploadedFile):

            file_path = os.path.join(settings.MEDIA_ROOT, "pdf", pdf_file.name)
            saved_file_name = save_uploaded_file(pdf_file, file_path)

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
                image_filename = os.path.join(settings.MEDIA_ROOT, "image", f'{post.pdf_file.name}-%i.png' % page.number)
                image_file = pixmap.save(image_filename)

                # update post
                new_image = SheetMusicImage(image=image_file)
                new_image.save()
                post.images.add(new_image)
            post.save()
            pdf_document.close()


            return Response({'message': 'Post created successfully'})
        
        return Response({'error': 'No file provided'}, status=400)
    
    # get posts
    def get(self, request, format=None):
        l = Post.objects.all()
        for object in l:
            print(object, file=sys.stderr)
        # serializer = MultiplePostSerializer(l)
        return Response({'hello': 'hello'})

    


# @method_decorator(ensure_csrf_cookie, name='dispatch')
@method_decorator(csrf_exempt, name='dispatch')
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
                user.save()

                user_profile = UserProfile(user=user, first_name='', last_name='')
                user_profile.save()

                return Response({ 'success': 'Account Created'})
        else:
            return Response({ 'error': 'Passwords do not match'})
        
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set'})

@method_decorator(csrf_protect, name='dispatch')
class CheckAuthenticatedView(APIView):
    def get(self, request, format=None):
        isAuthenticated = User.is_authenticated

        if isAuthenticated:
            return Response({ 'success': 'User Authenticated'})
        else:
            return Response({ 'error': 'User Not Authenticated'})
        
class LoginView(APIView):
    permission_classes = (permissions.AllowAny, )

    def post(self, request, format=None):
        data = self.request.data

        username = data['username']
        password = data['password']

        user = auth.authenticate(username=username, password=password)

        if user is not None:
            auth.login(request, user)
            return Response({ 'success': 'User Authenticated', 'username': username})
        else:
            return Response({ 'error', 'Error Authenticating User'})
        
@method_decorator(csrf_protect, name='dispatch')
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