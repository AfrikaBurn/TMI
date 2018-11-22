# TMI - Tribe Mobilisation Infrastructure


## Index

* [Prerequisites](#prerequisites)
* [People](#people)
  * [Installing](#installing-people)
  * [Running](#running-people)
  * [Testing](#testing-people)
  * [Stopping](#stopping-people)
* [Applications](#applications)
  * [Administration](#administration)
  * [Tribe](#tribe)
  * [Ground Zero](#groud-Zero)
  * [Events](#events)
  * [Incidents](#incidents)
  * [Web](#web)
  * [Inventory](#inventory)
  * [Projects](#projects)


## Prerequisites

* The [nodejs](https://nodejs.org) runtime.


## Recommended applications

* [Visual Studio](https://visualstudio.microsoft.com).


## People


### Recommended apps

* [Postman](https://www.getpostman.com) for testing the API endpoints.


### Installing people

Within a terminal, inside the downloaded TMI directory:
```
cd people
npm install
```


### Running people

Within a terminal, inside the downloaded TMI directory:
```
node people
```

You should see startup output ending in:

```
Occupying http://127.0.0.1:3000

TMI People is ready.
```

This means the people is running and awaiting requests.
Warnings will be present in the startup output until database integration has been completed.
For now TMI People runs in memory alone.


### Testing people

Fire up postman and import the [test collection](people/testing.postman_collection.json) at:
```
people/testing.postman_collection.json
```

You may start up the test runner in postman and execute the whole TMI collection, or fire them seperately as exmaples of requests to direct at the people.
Note that the tests are not idempotent and some will fail on subsequent test runs.
It is best to restart people before running the whole suite again.


### Stopping people

In the terminal where people is running simply press CTRL-C to terminate the process.

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

TMI People is done.
```

## Applications


### Administration

Admin is the first of the client applications and is meant to be a low level administration of the people elements.
It has begun to be implemented using [Angular](https://angular.io/).

Read more about administration in its [README.md](apps/admin/README.md)


#### Prerequisites

* [Angular](https://angular.io) for the Admin client application.


#### Installing Administration

1. Download and install [Angular](https://angular.io/).
1. Within a terminal, inside the downloaded TMI directory:

```
cd apps/admin
npm install
```

#### Running Administration

1. [Run TMI People](#Running).
1. Within another terminal, inside the downloaded TMI directory:

```
cd apps/admin
npm start
```

With a browser visit: http://localhost:4200/
You may login with the dummy account:
```
Username: Administrator
Password: Administrator
```

### Tribe

Social networking app that authenticates, represents connects and collects participants.


### Groud Zero

Realtime monitoring app of interactive statistics and trends.


### Events

Event organisation app, that allows scheduling, coordination and participation.


### Incidents

Incident app that logs, disseminates and escalates.


### Web

Website that educates, informs and promotes projects, collectives, initiatives and events.


### Inventory

Manage, track and trace assets and inventory.


### Projects

Create and collaborate.


## TODO

* Create People readme.
* Complete access and permission checking in People.
* Implement database stash for People.
* Update Admin readme.
* Complete Admin
* Complete request test set in Postman.
* Expand tests to inlude invalid requests.
* Develop client applications.

