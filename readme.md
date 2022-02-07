# TCSS558 Applied Distributed Computing Homework 1
This app implements an image classifier with transaction history. The client let's the user upload an image to a proxy server which in turn uses the third party azue cognitive API to give insights about the uploaded image and records the complete transaction in a postgres database.

The typical flow of the app is Client -> Proxy Server -> Third Party API -> Proxy Server -> Database -> Client

The app constitutes of two major compnents hw1_backend and hw1_frontend, the first one is the server and the latter is the client.

Currently deployed here: http://tcss558-homework1.uw.r.appspot.com/

## How to deploy the server (hw1_backend)
### Prerequisites
You should have installed a Python environment with version >= 3.9.
You should have installed Postgres > 10 or have third party service of the same.

### Instructions for Local
1. Open Terminal/Command Prompt and navigate the cloned directory.
2. Run `pip install -r requirements.txt` to install the dependencies.
3. Navigate to hw1_backend directory and run `python manage.py makemigrations`.
4. Run `python manage.py migrate`
5. Run `python manage.py runserver`
6. Update hw1_frontend/www/index.html to use the local endpoint provided by the previous step ({django_server}/api/images)
7. Open hw1_frontend/www/index.html in your browser. 

### Instruction for Cloud (Google / AWS)
1. Follow steps 1-5 above
2. Follow https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html to deploy the app (hw1_backend) to aws.
3. Follow https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/using-features.managing.db.html to create database
4. Update hw1_frontend/www/index.html to use the endpoint given by AWS
5. Follow https://cloud.google.com/appengine/docs/standard/python/getting-started/hosting-a-static-website to deploy the client (hw1_frontend) to gcloud
