from email.mime import image
from email.quoprimime import header_decode
from rest_framework.views import APIView
from .models import Image
import requests
import base64
from rest_framework.parsers import MultiPartParser, FormParser

from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Image
from .serializers import ImageSerializer
from rest_framework.decorators import api_view

class ImageViewSet(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def classify_image(self, image):
        url = 'https://tutorial1--cv.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Tags,Description'
        headers = {
            'Ocp-Apim-Subscription-Key': '81451e83dd51453da85b6ab37d3824ba',
            'Content-Type': 'multipart/form-data'
        }
        response = requests.post(url, data=base64.b64decode(image), headers=headers)
        if response.status_code == '200':
            print(response.text)
            response_data = response.json()
            description = response_data['description']['captions'][0]['text']
            categories = ','.join(response_data['description']['tags'])
            return description, categories

        print(response.text)
        return {}

    def get(self, request):
        if request.method == 'GET':
            images = Image.objects.all().order_by('-id')[:10]
            image_serializer = ImageSerializer(images, many=True)
            return JsonResponse(image_serializer.data, safe=False)
    
    def post(self, request):
        if request.method == 'POST':
            image_data = MultiPartParser().parse(request)
            description, categories = self.classify_image(image_data['image'])
            image_data['classification'] = categories
            image_data['description'] = description
            image_serializer = ImageSerializer(data=image_data)
            if image_serializer.is_valid():
                image_serializer.save()
                return JsonResponse('Entry Created in DB Successfully!', status=status.HTTP_201_CREATED, safe=False)
            return JsonResponse('Failed to save data to database!', status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)