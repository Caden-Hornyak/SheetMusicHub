# Generated by Django 5.0.2 on 2024-03-06 18:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sheetmusic', '0015_alter_comment_poster_alter_vote_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='description',
            field=models.TextField(null=True),
        ),
    ]