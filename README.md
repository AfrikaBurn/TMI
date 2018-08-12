# TMI - Tribe Mobilisation Infrastructure


## Prerequisites

* The [nodejs](https://nodejs.org) runtime that TMI core is based on.
* [Postman](https://www.getpostman.com) for testing the API endpoints.
* [Angular](https://angular.io) for the Admin client application.


## Core


### Installation

Within a terminal, inside the downloaded TMI directory:
```
cd people/core
npm install
```

### Running

Within a terminal, inside the downloaded TMI directory:
```
node people/core
```

You should see startup output ending in:

```
Occupying http://127.0.0.1:3000

TMI Core is ready.
```

This means the core is running and awaiting requests.
Warnings will be present in the startup output until database integration has been completed.
For now TMI Core runs in memory alone.


### Testing

Fire up postman and import the [test collection](people/core/testing.postman_collection.json) at:
```
people/core/testing.postman_collection.json
```

You may start up the test runner in postman and execute the whole TMI collection, or fire them seperately as exmaples of requests to direct at the core.
Note that the tests are not idempotent and some will fail on subsequent test runs.
It is best to restart core before running the whole suite again.

### Stopping

In the terminal where core is running simply press CTRL-C to terminate the process.

The output should be:
```
^C kill command received!

Retiring / service... done.
Retiring /agreement service... done.
Retiring /collective service... done.
Retiring /post service... done.
Retiring /profile service... done.
Retiring /user service... done.
Retiring /agreement/administrator service... done.
Retiring /agreement/moderator service... done.
Retiring /agreement/member service... done.
Retiring /agreement/guest service... done.

TMI Core is done.
```

## Admin

Admin is the first of the client applications and is meant to be a low level administration of the core elements.
It has begun to be implemented using [Angular](https://angular.io/).


### Installation

1. Download and install [Angular](https://angular.io/).
1. Within a terminal, inside the downloaded TMI directory:

```
cd people/admin
npm install
```


### Running

1. [Run TMI Core](#Running).
1. Within another terminal, inside the downloaded TMI directory:

```
cd people/admin
npm start
```

With a browser visit: http://localhost:4200/
You may login with the dummy account:
```
Username: Administrator
Password: Administrator
```

## TODO

* Create Core readme.
* Update Admin readme.
* Implement modality and permission checking in Core.
* Implement database stash for Core.
* Complete test request set in Postman.
* Expand tests to inlude invalid requests.
* Develop client applications.
