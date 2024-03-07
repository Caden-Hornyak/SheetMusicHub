from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view, parser_classes
from .serializers import (PostSerializerSingle, PostSerializerMultiple, 
                          UserProfileSerializer, CommentSerializer)
from .models import (Post, SheetMusicImage, UserProfile, 
                     Comment, Vote)
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
            post.description = request.data.get('description', '')
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
    def get(self, request, id, format=None):

        if id == 'multiple':
            serializer = PostSerializerMultiple(Post.objects.all(), many=True)
        else:
            try:
                serializer = PostSerializerSingle(Post.objects.get(id=id), context={ 'request': request })
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

class Votes(APIView):
    # update comment/post comment
    def post(self, request, object_type, id, format=None):
        try:
            value = request.data['value']

            if abs(value) != 1:
                raise Exception('Invalid Vote Value')

            user = self.request.user
            user_prof = UserProfile.objects.get(user=user)

            if object_type == 'post':
                object = Post.objects.get(id=id)
                vote_object = Vote.objects.filter(post=object, user=user_prof).first()
            elif object_type == 'comment':
                object = Comment.objects.get(id=id)
                vote_object = Vote.objects.filter(comment=object, user=user_prof).first()
            else:
                raise Exception('Invalid Object Vote Type')
            
            # if already voted on
            if vote_object:
                # if change in value
                if value != vote_object.value:
                    update = 2 * value
                    object.likes += update
                    vote_object.value = value
                    vote_object.save()
                # if undo of previous vote, delete vote
                else:
                    update = -value
                    object.likes += update
                    vote_object.delete()

            # if not already voted on, create vote  
            else:
                if object_type == 'post':
                    new_vote_object = Vote(post=object, user=user_prof, value=value)
                else:
                    new_vote_object = Vote(comment=object, user=user_prof, value=value)
                new_vote_object.save()
                update = value
                object.likes += update

            object.save()

        except Exception as e:
            print(e, file=sys.stderr)
            error_message = f"An exception occurred: {type(e).__name__}"
            return Response({'error': error_message}, status=500)
        
        return Response({ 'update': update })

class Comments(APIView):
    def post(self, request, format=None):
        try:
            data = self.request.data

            object_type = data['object_type']
            poster = UserProfile.objects.get(user=self.request.user)
    
            text = data['text']

            
            comment = Comment(poster=poster, text=text)
            comment.save()

            object_id = data['object_id']

            if object_type == 'Post':
                object = Post.objects.get(id=object_id)
                object.comments.add(comment)
            elif object_type == 'Comment':
                object = Comment.objects.get(id=object_id)
                object.child_comment.add(comment)

            object.save()

            serializer = CommentSerializer(comment, context={ 'request': request })
            return Response({ 'comment': serializer.data })
        
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({ 'error': 'Unable to create comment'})
