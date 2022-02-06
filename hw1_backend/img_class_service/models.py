from wsgiref.simple_server import demo_app
from django.db import models


class Image(models.Model):
    '''Class describes an image in the database with some extra fields.'''
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    image = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    classification = models.TextField(blank=True)
    description = models.TextField(blank=True)
    favorite = models.BooleanField(blank=False, default=False)