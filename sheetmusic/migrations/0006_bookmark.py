# Generated by Django 5.0.2 on 2024-03-21 03:13

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sheetmusic', '0005_remove_note_timestamp_note_end_timestamp_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Bookmark',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sheetmusic.comment')),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='sheetmusic.post')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sheetmusic.userprofile')),
            ],
        ),
    ]
