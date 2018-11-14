# Transport APIs
## Includes creating, updating order status and listing orders.

## Uses:
- [Node.js](https://nodejs.org/en/) (v8.12.0) server that supports the APIs.
- [MongoDB](https://www.mongodb.com/) (v3.4.18) the database layer.
- [Docker](https://www.docker.com/) as the container service to isolate the environment.

## How to Run
1. Clone/Download the project
2. Set Google Distance Matrix API key in config/constants.js, key: `googleMapsKey`
3. Execute the *start.sh* bash file via `./start.sh` to start the project. This will:
    1. Check if npm is installed, if not, will install npm.
    2. Start the docker environment. This will:
        * Build the Node.js image
        * Download the mongo image
        * Start the Node.js server
    3. After docker-compose has built and started the project, automated test cases will start running.

## Google Maps Distance Matric API configuration
- Set the API key in config/constants.js, key: `googleMapsKey`

## Starting project manually, using docker
1. Clone/Download the project
1. Run `docker-compose up` from terminal
2. Web APIs will be accessible at `http://localhost:8080`

## Run automated tests from terminal (assumimg npm and node.js are installed)
1. Run `npm i` to install dependencies for the project
2. After dependencies have installed, run `npm test test/` to initiate automated test cases

## API Reference Documentation

- **GET** `/orders?page=:page&limit=:limit`: Fetch paginated orders

    - Response :
	```
	    [
            {
                "distance": 1199398,
                "status": "TAKEN",
                "id": "5bebba7c1c2c2d001c3e92f3"
            },
            {
                "distance": 2000,
                "status": "UNASSIGNED",
                "id": "5bebba7c1c2c2d001c3e92f1"
            },
        ]
	```
- **POST** `/orders`: Create a new order

	- Request:
	```
    {
        "origin" :["28.704060", "77.102493"],
        "destination" :["28.535517", "77.391029"]
    }
	```

    - Response:
	```
    {
        "id": "5bebcf381c2c2d001c3e92f4",
        "distance": 1071,
        "status": "UNASSIGNED"
    }
	```

- **PATCH** `/orders/:id`: Update the status of a particular order using it's id

	- Request:
	```
    {
        "status" : "TAKEN"
    }
	```

    - Responsw:
	```
    {
        "status": "SUCCESS"
    }
	```

## Folder Structure

**/config**

- Includes the project specific constants and configurations.

**/lib**

- **`commonUtils.js`** has common functionality to be used throughout the app.
- **`responseHandlers.js`** contains various response functions aiding in sending API responses.

**/orders**

- Separate orders folder to maintain modularity of code.
- **`controllers`** contains order related controllers to control basic flow of order related functionalities
- **`models`** has the model definition of orders.
- `app.js` is what builds and configures the express app
- **`validations`** includes the JSONschema based validation JSONs to be used in creating, patching and listing orders.

**/routes**

- Contains the project specific routes

**/test**

- Has the automated integration and unit test cases, which can be run to verify the project.

**/app.js**
- The initiator file, that starts the server and initiated all configurations.