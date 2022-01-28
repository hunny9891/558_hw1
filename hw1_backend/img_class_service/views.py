from ast import parse
from email.mime import image
from email.quoprimime import header_decode
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from .models import Image
import requests
import base64
from rest_framework.parsers import MultiPartParser, FormParser

from django.http import HttpResponse
from django.http.response import JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status

from .models import Image
from .serializers import ImageSerializer
from rest_framework.decorators import api_view, parser_classes


def classify_image_from_url():
    import requests

    url = "https://tutorial1--cv.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Tags,Description"

    payload={"url": "https://awol.junkee.com/wp-content/uploads/2017/01/new-zealand-4308-e1483593214263.jpg"}
    headers = {
    'Ocp-Apim-Subscription-Key': '81451e83dd51453da85b6ab37d3824ba',
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, json=payload)

    print(response.text)

def classify_image(image):
    url = 'https://tutorial1--cv.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Tags,Description'
    headers = {
        'Ocp-Apim-Subscription-Key': '81451e83dd51453da85b6ab37d3824ba',
    }
    #bin_image = open('./img_class_service/babyme.jpeg', 'rb')
    files = [('', ('dummy.jpeg', image, 'image/jpeg'))]
    response = requests.post(
        url, data={}, headers=headers, files=files)
    if response.status_code == 200:
        response_data = response.json()
        description = response_data['description']['captions'][0]['text']
        categories = ','.join(response_data['description']['tags'])
        return description, categories

    return ()

@api_view(['GET', 'POST', 'OPTIONS'])
@parser_classes([FormParser, MultiPartParser])
def transactions(request):

    if request.method == 'GET':
        images = Image.objects.all().order_by('-id')[:10]
        image_serializer = ImageSerializer(images, many=True)
        return JsonResponse(image_serializer.data, safe=False)

    if request.method == 'POST':
        image_data = request.data
        image = request.FILES['image'].read()
        description, categories = classify_image(image)
        image_data['classification'] = categories
        image_data['description'] = description
        image_data['image'] = str(image)
        image_serializer = ImageSerializer(data=image_data)

        if image_serializer.is_valid():
            image_serializer.save()
            #print('Image saved to db successfully with details!')
            del image_data['image']
            return JsonResponse(image_data, status=status.HTTP_201_CREATED, safe=False)
        return JsonResponse('Failed to save data to database!', status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)
