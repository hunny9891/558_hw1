import requests
from django.http.response import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, parser_classes
from rest_framework.parsers import FormParser, MultiPartParser

from .models import Image
from .serializers import ImageSerializer


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


@api_view(['GET', 'POST'])
@parser_classes([FormParser, MultiPartParser])
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
        image_data = request.data
        image = request.FILES['image'].read()
        description, categories = classify_image(image)
        image_data['classification'] = categories
        image_data['description'] = description
        image_data['image'] = str(image)
        image_serializer = ImageSerializer(data=image_data)

        if image_serializer.is_valid():
            image_serializer.save()
            print('Image saved to db successfully with details!')
            return JsonResponse(image_data, status=status.HTTP_201_CREATED, safe=False)
        return JsonResponse('Failed to save data to database!', status=status.HTTP_500_INTERNAL_SERVER_ERROR, safe=False)
