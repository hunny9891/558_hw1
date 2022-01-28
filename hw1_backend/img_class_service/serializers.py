from rest_framework import serializers
from .models import Image


class ImageSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Image
        fields = ["name", "image", "timestamp",
                  "classification", "description"]

        def __init__(self) -> None:
            self.fields["classification", "description",
                        "timestamp"].required = False
