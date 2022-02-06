from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ["id","name", "image", "timestamp",
                  "classification", "description", "favorite"]

        def __init__(self) -> None:
            self.fields["classification", "description",
                        "timestamp", "favorite"].required = False
