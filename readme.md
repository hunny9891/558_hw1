# TCSS558 Applied Distributed Computing Homework 1 / Homework 2
This app implements an image classifier with transaction history. The client lets the user upload an image to a proxy server which in turn uses the third party Azure cognitive API to give insights about the uploaded image and records the complete transaction in a postgres database.

The typical flow of the app is Client -> Proxy Server -> Third Party API -> Proxy Server -> Database -> Client

The app constitutes of two major compnents hw1_backend and hw1_frontend, the first one is the server and the latter is the client.

~~Currently deployed here: http://tcss558-homework1.uw.r.appspot.com/~~

## API Documentation
***Get Query History***
----
  Returns last 10 images and corresponding details that were processed by the proxy server 
* **URL**

  /api/images

* **Method:**

  `GET`
  
*  **URL Params**
 
   None

* **Data Params**

  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json
	[
	    {
	        "id": 9,
	        "name": "sunset.jpg",
	        "image": "data:image/jpeg;base64,x...==",
	        "timestamp": "2022-02-17T18:54:01.596533Z",
	        "classification": "nature,sunset,night sky",
	        "description": "a silhouette of a deer in front of a sunset",
	        "favorite": false
	    },
	    ...
	    {
	        "id": 0,
	        "name": "foo.jpg",
	        "image": "data:image/jpeg;base64,x...==",
	        "timestamp": "2022-02-17T05:11:19.687503Z",
	        "classification": "tree,animal,tiger,mammal,blurry",
	        "description": "a tiger in the grass",
	        "favorite": false
	    }
	]
	```

* **Sample Call:**

  ```javascript
    $.ajax({
      url: "host/api/images",
      dataType: "json",
      type : "GET",
      success : function(r) {
        console.log(r);
      }
    });
  ```

***Get Image Description***
----
  Given that a user provides an image (as a base64 string), return tags and a description of that image
* **URL**

  /api/images

* **Method:**

  `POST`
  
*  **URL Params**
 
   None

* **Data Params**

   **Required:**
 
   `name=[string], image=[string]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
	{
	    "name": "sunset.jpg",
	    "classification": "nature,sunset,night sky",
	    "description": "a silhouette of a deer in front of a sunset"
	}
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```json
	{ 
		"error" : "Provide the required arguments" 
	}
	```

* **Sample Call:**

  ```javascript
	var json_data = {};
	json_data.name = "sunset.jpg";
	json_data.image = "data:image/jpeg;base64,xxx==";

    $.ajax({
      url: "host/api/images",
		type: "POST",
		dataType: "json",
		contentType: 'application/json',
		data: JSON.stringify(json_data),
      success : function(r) {
        console.log(r);
      }
    });
  ```
***Update Query Property***
----
  Update a property of a query stored in the database. Intended for favoriting/unfavoriting certain queries
* **URL**

  /api/images

* **Method:**

  `PUT`
  
*  **URL Params**
 
   None

* **Data Params**

   **Required:**
 
   `id=[integer]`

* **Success Response:**

  * **Code:** 200 <br />
    **Content:**
    ```json
	"Record Updated Successfully!"
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```json
	{ 
		"error" : "Failed to update image!" 
	}
	```

* **Sample Call:**

  ```javascript
	var json_data = {};
	json_data.id = 3;

    $.ajax({
      url: "host/api/images",
		type: "PUT",
		dataType: "json",
		contentType: 'application/json',
		data: JSON.stringify(json_data),
      success : function(r) {
        console.log(r);
      }
    });
  ```

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

