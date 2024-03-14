from rest_framework.response import Response
from .serializers import (PostSerializerSingle, PostSerializerMultiple, 
                          UserProfileSerializer, CommentSerializer)
from .models import (Post, Image, Video, PDF, UserProfile, 
                     Comment, Vote)
from django.http import JsonResponse
import sys
from rest_framework.views import APIView
from rest_framework import permissions
from django.contrib.auth.models import User
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
import django.contrib.auth as auth
from django.views.decorators.csrf import csrf_exempt
import os
from django.conf import settings
from django.contrib.auth.decorators import login_required
import json
from django.core.files.storage import default_storage
from django.core.files.base import File

def piano_pass_convert(piano_password):
    stored_password = ''
    for kt_pair in piano_password:
        kt_pair[0].sort()
        for note in kt_pair[0]:
            stored_password += note
        stored_password += '|'
    return stored_password

@method_decorator(ensure_csrf_cookie, name='dispatch')
class Posts(APIView):
    permission_classes = (permissions.AllowAny, )
    
    # create post
    @method_decorator(login_required)
    def post(self, request, format=None):
        try:
            
            max_uploads = 10

            data = request.data

            uploaded_files = request.FILES.getlist('files')
            file_types = json.loads(data['file_types'])

            # image = Image(name=uploaded_files[0].name, )

            user_prof = UserProfile.objects.get(user=request.user)
            post = Post(title=data['title'], description=data['description'], poster=user_prof)
            post.save()

            for uploaded_file, file_type in zip(uploaded_files, file_types):
                if file_type.startswith('image'): file_type='image'
                elif file_type.startswith('video'): file_type='video'
                elif file_type == 'application/pdf': file_type='pdf'
                else: pass
                
                file_path = os.path.join(settings.MEDIA_ROOT, (file_type+'s'), uploaded_file.name)
                default_storage.save(file_path, uploaded_file)

                print(file_path, file=sys.stderr)

                if file_type == 'image':
                    image = Image(name=uploaded_file.name)
                    with open(file_path, 'rb') as f:
                        image.file.save(uploaded_file.name, File(f), save=True)
                    image.save()
                    post.images.add(image)

                elif file_type == 'video':
                    video = Video(name=uploaded_file.name)
                    with open(file_path, 'rb') as f:
                        video.file.save(uploaded_file.name, File(f), save=True)
                    video.save()
                    post.videos.add(video)

                elif file_type == 'pdf':
                    pdf = PDF(name=uploaded_file.name)
                    with open(file_path, 'rb') as f:
                        pdf.file.save(uploaded_file.name, File(f), save=True)
                    pdf.save()
                    post.pdf_files.add(pdf)

                else:
                    print(f'Unsupported filetype!', file=sys.stderr)

                
            post.save()
            return Response({'success': 'Post created successfully', 'id': post.id})
            
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({'error': 'Unable to Create Post'})

    
    # get posts for homepage or single view
    def get(self, request, id, format=None):

        if id == 'multiple':
            serializer = PostSerializerMultiple(Post.objects.all(), many=True)

        else:
            try:
                serializer = PostSerializerSingle(Post.objects.get(id=id), context={ 'request': request })
                # print(serializer.data, file=sys.stderr)
            except Exception as e:
                print("Post:get ", e, file=sys.stderr)
                return Response({ 'error': 'Post does not exist'})
            

        return Response(serializer.data)

@method_decorator(ensure_csrf_cookie, name='dispatch')
class RegisterView(APIView):
    permission_classes = (permissions.AllowAny, )

    # account creation
    def post(self, request, type, format=None):
        try:
            data = self.request.data
            username = data['username']

            if User.objects.filter(username=username).exists():
                return Response({ 'error': 'Username already exists '})
            
            if type == 'piano':
                
                pass_pair = data['piano_password']
                pass_l = pass_pair[0]
                pass_re_l = pass_pair[1]

                piano_pass = piano_pass_convert(pass_l)
                piano_pass_re = piano_pass_convert(pass_re_l)

                if piano_pass != piano_pass_re:
                    return Response({ 'error': 'Passwords do not match'})
                else:
                    user = User.objects.create_user(username=username, password=piano_pass)
                    print(username, piano_pass, file=sys.stderr)
                    user_profile = UserProfile.objects.create(user=user, first_name='', last_name='')

                    return Response({ 'success': 'Account Created'})
                
            elif type == 'normal':
                
                password = data['password']
                re_password = data['re_password']

                if password == re_password:
                    
                    if len(password) < 6:
                        return Response({ 'error': 'Normal password is less than 6 characters '})
                    else:
                        user = User.objects.create_user(username=username, password=password)

                        user_profile = UserProfile.objects.create(user=user, first_name='', last_name='')

                        return Response({ 'success': 'Account Created'})
                else:
                    return Response({ 'error': 'Normal passwords do not match'})
            else:
                raise Exception('Invalid Password Type')
            
        except Exception as e:
            print("RegisterView-POST: ", e, file=sys.stderr)
        
@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCSRFToken(APIView):
    permission_classes = (permissions.AllowAny, )

    # establish cookie with backend
    def get(self, request, format=None):
        return Response({ 'success': 'CSRF cookie set'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class CheckAuthenticatedView(APIView):

    # check if user is authenticated
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

    # log user in
    def post(self, request, type, format=None):
        try:
            data = self.request.data

            username = data['username']

            if type == 'piano':
                password = piano_pass_convert(data['piano_password'])
            else:
                password = data['password']

            user = auth.authenticate(username=username, password=password)

            if user:
                auth.login(request, user)
                return Response({ 'success': 'User Authenticated'})
            else:
                return Response({ 'error': 'Error Authenticating User'})
        except Exception as e:
            print('LoginView-POST: ', e, file=sys.stderr)

@method_decorator(ensure_csrf_cookie, name='dispatch')       
class LogoutView(APIView):
    
    # log user out
    def post(self, request, format=None):
        auth.logout(request)
        return Response({ 'success': 'Successfully logged out'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class DeleteAccountView(APIView):

    # delete user account
    def delete(self, request, format=None):
        user = self.request.user

        try:
            user = User.objects.filter(id=user.id).delete()

            return Response({ 'success': 'User deleted successfully' })
        except:
            return Response({ 'error': 'User was not deleted successfully' })

@method_decorator(ensure_csrf_cookie, name='dispatch')
class UserProfiles(APIView):

    # get user profile
    def get(self, request, format=None):
        try: 
            user = self.request.user
            user_profile = UserProfile.objects.get(user=user)
            serializer = UserProfileSerializer(user_profile)

            return Response({ 'profile': serializer.data, 'username': user.username})
        except:
            return Response({ 'error': "Something went wrong displaying User Profile."})
    
    # update user profile
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

@method_decorator(ensure_csrf_cookie, name='dispatch')
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

@method_decorator(ensure_csrf_cookie, name='dispatch')
class Comments(APIView):

    # add comment to post or comment
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
