from rest_framework.serializers import ModelSerializer
from .models import Post

class MultiplePostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'likes', 'comment_count', 'pdf_file', 'date_created']

class SinglePostSerializer(ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validated_data):
        # Implement your custom logic for creating the model instance
        instance = Post.objects.create(title=validated_data['title'], pdf_file=validated_data['pdf_file'])
        return instance
