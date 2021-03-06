import base64
from http.client import BAD_REQUEST
from re import M

import requests
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser, JSONParser

from .models import Image
from .serializers import ImageSerializer

#Constants
ERROR = "error"
MESSAGE = "message"

ERROR_MESSAGE = {
    "error": ""
}

SUCCESS_MESSAGE = {
    "message": ""
}

def decode_to_bytes(sixtyfourencoded: str) -> bytes:
    """
    Encodes a 64 bit string to ascii character code
    and then decodes to bytes.

    Args:
        sixtyfourencoded (str): 64bit encoded representation of image

    Returns:
        [bytes]: Image represented as bytes.
    """

    sixtyfourencoded = sixtyfourencoded.split(',')[1]  # remove "data:image/png;base64," from string
    encoded = sixtyfourencoded.encode("ascii")
    decoded = base64.decodebytes(encoded)

    return decoded

def classify_image(image):
    """
    Helper function to call the azure cognitive api
    with the input image received in the http request
    and get the azure response and return the description
    and categories for the image.

    Args:
        image (str): The image recieved in the http request 
                    as a 64 bit encoded string.

    Returns:
        [tuple]: A tuple of description and categories for the
                    image.
    """
    url = 'https://what-is-this-thing.cognitiveservices.azure.com/vision/v3.2/analyze?visualFeatures=Tags,Description'
    headers = {
        'Ocp-Apim-Subscription-Key': '52b61024cb14439e98f6485249311b0e',
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


@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@parser_classes([FormParser, MultiPartParser, JSONParser])
def transactions(request):
    """
    This function sends the image from the request to azure
    cognitive api with the help of a helper function and
    records the respose and the image in the database
    to maintain transactions history.

    Args:
        request (HttpRequest): An http request.

    Returns:
        [JsonResponse]: A json response with all fields populated.
    """
    if request.method == 'GET':
        images = Image.objects.all().order_by('-id')[:10]
        image_serializer = ImageSerializer(images, many=True)
        return JsonResponse(image_serializer.data, safe=False)
    
    if request.method == 'POST':
        
        try:
            image_data = request.data
            # image = request.FILES['image'].read()
            byteimage = decode_to_bytes(image_data['image'])
            description, categories = classify_image(byteimage)
            image_data['classification'] = categories
            image_data['description'] = description
            image_serializer = ImageSerializer(data=image_data)

            if image_serializer.is_valid():
                image_serializer.save()
                del image_data['image']  # client already has source image, no need to send back
                return JsonResponse(image_data, status=status.HTTP_201_CREATED, safe=False)
            ERROR_MESSAGE[ERROR] = "Failed to process Image!"
            return JsonResponse(ERROR_MESSAGE, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)
        except Exception as e:
            print(e)
            ERROR_MESSAGE[ERROR] = "Failed to process Image!"
            return JsonResponse(ERROR_MESSAGE, status=status.HTTP_400_BAD_REQUEST)

    if request.method == 'PUT':
        try:
            image_data = request.data
            id = image_data['id']
            image = Image.objects.filter(id=id).first()
            image_data['id'] = image.id
            image_data['image'] = image.image
            image_data['timestamp'] = image.timestamp
            image_data['classification'] = image.classification
            image_data['description'] = image.description
            image_serializer = ImageSerializer(image, data=image_data)
            if image_serializer.is_valid():
                image_serializer.save()
                SUCCESS_MESSAGE[MESSAGE] = "Record Updated Successfully!"
                return JsonResponse(SUCCESS_MESSAGE, status=status.HTTP_200_OK, safe=False)
            else:
                ERROR_MESSAGE[ERROR] = "Record Update Failed!"
                return JsonResponse(ERROR_MESSAGE, status=status.HTTP_400_BAD_REQUEST, safe=False)
        except Exception as e:
            print(e)
            ERROR_MESSAGE[ERROR] = "Record Update Failed!"
            return JsonResponse(ERROR_MESSAGE, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)

    if request.method == 'DELETE':
        try:
            image_data = request.data
            id = image_data['id']
            image = Image.objects.filter(id=id)
            image.delete()
            SUCCESS_MESSAGE[MESSAGE] = 'Record deleted successfully!'
            return JsonResponse(SUCCESS_MESSAGE, status=status.HTTP_200_OK,safe=False)
        except Exception as e:
            print(e)
            ERROR_MESSAGE[ERROR] = "Record deletion failed!"
            return JsonResponse(ERROR_MESSAGE, status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)



@api_view(['GET'])
@parser_classes([JSONParser])
def get_favorites(request):
    """
    Method to get top 10 favorite images from the database.

    Args:
        request (HttpRequest): An http get request

    Returns:
        [JsonResponse]: Returns top 10 most recent favorites.
    """
    if request.method == 'GET':
        images = Image.objects.filter(favorite=True).order_by('-id')[:10]
        image_serializer = ImageSerializer(images, many=True)
        return JsonResponse(image_serializer.data, safe=False)
