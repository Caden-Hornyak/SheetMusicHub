# Generated by Django 5.0.2 on 2024-02-27 05:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sheetmusic', '0003_sheetmusicimage_alter_post_pdf_file_post_images'),
    ]

    operations = [
        migrations.AlterField(
            model_name='post',
            name='images',
            field=models.ManyToManyField(blank=True, to='sheetmusic.sheetmusicimage'),
        ),
    ]
