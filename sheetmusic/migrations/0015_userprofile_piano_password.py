# Generated by Django 5.0.3 on 2024-04-02 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sheetmusic', '0014_remove_room_room_name'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='piano_password',
            field=models.BooleanField(default=False),
        ),
    ]
