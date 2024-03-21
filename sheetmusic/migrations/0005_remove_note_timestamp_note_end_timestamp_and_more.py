# Generated by Django 5.0.2 on 2024-03-20 04:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sheetmusic', '0004_comment_parent_post'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='note',
            name='timestamp',
        ),
        migrations.AddField(
            model_name='note',
            name='end_timestamp',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='note',
            name='start_timestamp',
            field=models.IntegerField(default=0),
        ),
    ]