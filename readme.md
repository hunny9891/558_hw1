# TCSS558 Applied Distributed Computing Homework 1
This app implements an image classifier with transaction history. The client let's the user upload an image to a proxy server which in turn uses the third party azue cognitive API to give insights about the uploaded image and records the complete transaction in a postgres database.

The typical flow of the app is Client -> Proxy Server -> Third Party API -> Proxy Server -> Database -> Client

The app constitutes of two major compnents hw1_backend and hw1_frontend, the first one is the server and the latter is the client.

## How to deploy the server (hw1_backend)
### Prerequisites
You should have installed a Python environment with version >= 3.9.
You should have installed Postgres > 10 or have third party service of the same.

### Instructions for Local
1. Clone this git repository.
2. Open Terminal/Command Prompt and navigate the cloned directory.
3. Run `pip install -r requirements.txt` to install the dependencies.
4. Navigate to hw1_backend directory and run `python manage.py makemigrations`.
5. Run `python manage.py migrate`
6. Run `python manage.py runserver`
7. You should see the server up and running and ready for requests.

### Instruction for Cloud (Google Cloud)
