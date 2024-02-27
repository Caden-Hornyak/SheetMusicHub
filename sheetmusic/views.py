import json
from django.shortcuts import render, get_object_or_404
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import MultiplePostSerializer, SinglePostSerializer
from .models import Post, SheetMusicImage
import fitz
from django.http import JsonResponse
from rest_framework import status
import sys
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

@api_view(['POST'])
def createPost(request):
    print(request.body, file=sys.stderr)

    serializer = SinglePostSerializer(data=request.body)
    
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'File uploaded successfully'}, status=status.HTTP_201_CREATED)
    else:
        return Response({'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


    new_post = Post(title=title, pdf_file=pdf_file, comment_count=0, likes=0)
    new_post.save()

    pdf_document = fitz.open(pdf_file)
    for page_number in range(pdf_document.page_count):
        page = pdf_document[page_number]
        image = page.get_pixmap().get_bits()

        new_image = SheetMusicImage(image=image)
        new_image.save()
        new_post.images.add(new_image)
    new_post.save()
    pdf_document.close()

    return JsonResponse({'message': 'Post Created'})

