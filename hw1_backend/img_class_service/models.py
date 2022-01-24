from django.db import models

class Image(models.Model):
    '''Class describes an image in the database with some extra fields.'''
    name = models.CharField(max_length=100)
    image = models.TextField()
    timestamp = models.DateTimeField()
    classification = models.TextField()
    description = models.TextField()