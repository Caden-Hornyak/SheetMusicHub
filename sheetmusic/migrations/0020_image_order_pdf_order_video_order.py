# Generated by Django 5.0.2 on 2024-03-12 16:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sheetmusic', '0019_rename_image_image_file_rename_video_pdf_file_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='pdf',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='video',
            name='order',
            field=models.IntegerField(default=0),
        ),
    ]
