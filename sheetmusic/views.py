from rest_framework.response import Response
from .serializers import (PostSerializerSingle, PostSerializerMultiple, 
                          UserProfileSerializer, CommentSerializer, SongSerializer,
                          CommentNoChildrenSerializer)
from .models import (Post, Image, Video, PDF, UserProfile, 
                     Comment, Vote, Song, Note, SongNote, Bookmark)
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

# convert raw notes to notes + chords for pass
def piano_pass_convert(piano_password):
    stored_password = ''
    ptr = 0
    curr_chord = []
    while ptr < len(piano_password):
        start_ptr = ptr
        while ptr < len(piano_password) and (
        ptr == start_ptr or piano_password[ptr][1] - piano_password[ptr-1][1]) <= 65:
            curr_chord.append(piano_password[ptr][0])
            ptr += 1

        curr_chord.sort()
        stored_password += ''.join(curr_chord) + '|'
        curr_chord.clear()
    
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


            user_prof = UserProfile.objects.get(user=request.user)
            post = Post.objects.create(title=data['title'], description=data['description'], poster=user_prof)
            
            for uploaded_file, file_type in zip(uploaded_files, file_types):
                if file_type.startswith('image'): file_type='image'
                elif file_type.startswith('video'): file_type='video'
                elif file_type == 'application/pdf': file_type='pdf'
                else: pass


                if file_type == 'image':
                    image = Image.objects.create(name=uploaded_file.name, file=uploaded_file)
                    post.images.add(image)

                elif file_type == 'video':
                    video = Video.objects.create(name=uploaded_file.name, file=uploaded_file)
                    post.videos.add(video)

                elif file_type == 'pdf':
                    pdf = PDF.objects.create(name=uploaded_file.name, file=uploaded_file)
                    post.pdf_files.add(pdf)

                else:
                    print(f'Unsupported filetype!', file=sys.stderr)

            if 'songs' in data:
                for song_id in json.loads(data['songs']):
                    try:
                        song = Song.objects.get(id=song_id)
                    except Exception as e:
                        song = ''
                    
                    if song: post.songs.add(song)

                
            post.save()
            return Response({'success': 'Post created successfully', 'id': post.id})
            
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({'error': 'Unable to Create Post'})

    
    # get posts for homepage or single view
    def get(self, request, id='multiple', format=None):

        if id == 'multiple':
            serializer = PostSerializerMultiple(Post.objects.all(), many=True, context={ 'request': request })

        else:
            try:
                serializer = PostSerializerSingle(Post.objects.get(id=id), context={ 'request': request })

                print(serializer.data, file=sys.stderr)
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
                    user_profile = UserProfile.objects.create(user=user, first_name='', last_name='', piano_password=True)

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
            return Response({ 'error': 'Failed to Create Account'})
        
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
            return Response({ 'error': 'Error Authenticating User'})

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
            user_prof = UserProfile.objects.get(user=user)
            
            data = request.data

            if len(data['first_name']) > 0:
                user_prof.first_name = data['first_name']

            if len(data['password']) > 0:
                if data['password_type'] == 'piano':
                    piano_pass = json.loads(data['password'])
                    pass_l = piano_pass[0]
                    pass_re_l = piano_pass[1]

                    piano_pass = piano_pass_convert(pass_l)
                    piano_pass_re = piano_pass_convert(pass_re_l)

                    if piano_pass != piano_pass_re:
                        return Response({ 'error': 'Passwords do not match'})
                    else:
                        user.set_password(piano_pass)
                else:
                    if data['password'] == data['conf_password']:
                        user.set_password(data['password'])

            if len(data['last_name']) > 0:
                user_prof.last_name = data['last_name']

            if len(data['username']) > 0:
                user.username = data['username']
                        


            if data['profile_picture']:
                uploaded_img = request.FILES['profile_picture']

                user_prof.profile_picture = uploaded_img

            user_prof.save()
            user.save()


            return Response({ 'success ': 'Successfully updated profile' })
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
                object.comment_count += 1
                comment.parent_post = object
            elif object_type == 'Comment':
                object = Comment.objects.get(id=object_id)
                object.child_comment.add(comment)
                comment.parent_post = object.parent_post

            comment.save()
            object.save()

            serializer = CommentSerializer(comment, context={ 'request': request })
            return Response({ 'comment': serializer.data })
        
        except Exception as e:
            print(e, file=sys.stderr)
            return Response({ 'error': 'Unable to create comment'})
        
    def get(self, request, id, format=None):
        # try:
            if id == 'multiple':
                user_prof = UserProfile.objects.get(user=self.request.user)
                comments = Comment.objects.filter(poster=user_prof)
                serializer = CommentNoChildrenSerializer(comments, many=True)
                return Response(serializer.data)

        # except Exception as e:
        #     print('Comments:get ', e, file=sys.stderr)
        #     return Response({ 'error': 'Unable to retrieve user comments'})

@method_decorator(ensure_csrf_cookie, name='dispatch')
class Songs(APIView):
    @method_decorator(login_required)
    def post(self, request, format=None):
        try:
            data = self.request.data
            
            user_song = data['song']
            name = data['name']

            user = self.request.user
            user_prof = UserProfile.objects.get(user=user)

            song_instance = Song.objects.create(name=name)

            user_prof.songs.add(song_instance)
            user_prof.save()

            for index, item in enumerate(user_song):
                if index == 0:
                    start_time = item[1]
                note = Note.objects.create(note=item[0], start_timestamp=(item[1] - start_time), end_timestamp=(item[2] - start_time))
                song_note_through = SongNote.objects.create(song=song_instance, note=note, order=index)

            
            song_instance.save()

            serializer = SongSerializer(song_instance)
            return Response({ 'song': serializer.data })
        
        except Exception as e:
            print('Songs:post ', e, file=sys.stderr)
            return Response({ 'error': 'Unable to create song' })
    
    def get(self, request, id, format=None):
        try:
            if id == 'multiple':
                user = self.request.user
                user_prof = UserProfile.objects.get(user=user)
                songs = user_prof.songs.all()
                serializer = SongSerializer(songs, many=True)
            else:
                song = Song.objects.get(id=id)
                serializer = SongSerializer(song)

            return Response(serializer.data)
        except Exception as e:
            print('Songs:get ', e, file=sys.stderr)
            return Response({ 'error': 'Unable to get song' })
        
@method_decorator(ensure_csrf_cookie, name='dispatch')   
class Bookmarks(APIView):
    @method_decorator(login_required)
    def post(self, request, type, format=None):
        try:
            user_prof = UserProfile.objects.get(user=self.request.user)
            data = request.data

            if type == 'post':
                
                post_id = data['post']
                post = Post.objects.get(id=post_id)

                try:
                    saved_bookmark = Bookmark.objects.get(user=user_prof, post=post)
                    saved_bookmark.delete()
                except Bookmark.DoesNotExist:
                    bookmark = Bookmark.objects.create(user=user_prof, post=post)

                serializer = PostSerializerMultiple(post, context={ 'request': request })
                return Response(serializer.data)

            elif type == 'comment':
                comment_id = data['comment']
                comment = Comment.objects.get(id=comment_id)

                try:
                    saved_bookmark = Bookmark.objects.get(user=user_prof, comment=comment)
                    saved_bookmark.delete()
                except Bookmark.DoesNotExist:
                    bookmark = Bookmark.objects.create(user=user_prof, comment=comment)

                serializer = CommentSerializer(comment, context={ 'request': request })
                return Response(serializer.data)

            else:
                return Response({'error': 'Invalid bookmark object type'})

        except Exception as e:
            print('Bookmark:post ', e, file=sys.stderr)
            return Response({'error': 'Error saving bookmark.'})
        
    @method_decorator(login_required)
    def get(self, request, type, format=None):
        try:
            user_prof = UserProfile.objects.get(user=self.request.user)
            data = request.data

            if type == 'post':
                bookmarks = Bookmark.objects.filter(user=user_prof, comment=None)

                serializer = PostSerializerMultiple([bookmark.post for bookmark in bookmarks], many=True, context={ 'request': request })
                return Response(serializer.data)

            elif type == 'comment':
                bookmarks = Bookmark.objects.filter(user=user_prof, post=None)

                serializer = CommentNoChildrenSerializer([bookmark.comment for bookmark in bookmarks], many=True, context={ 'request': request })
                return Response(serializer.data)

            else:
                return Response({'error': 'Invalid bookmark object type'})

            
        except Exception as e:
            print('Bookmark:get ', e, file=sys.stderr)
            return Response({'error': 'Error getting bookmark.'})