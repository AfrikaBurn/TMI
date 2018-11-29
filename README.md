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

People is the backbone of TMI and manages users, collectives, profiles,
agreements and posts. It enforces positionality and access to only allow a user
to interact with the information they own or curate in ways the owners of said
information have consented to.

* [More about TMI People (including API)](./people/README.md).


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
Spinning up MINImal MIcroservices for TMI People

    WARNING: Memory stashes intended for testing only!
    They evaporate once the server stops!
    WARNING: Using memory based stash for session storage!
    It will fail with multiple connections!
    Use another stash for production.


Occupying http://127.0.0.1:3000

TMI People is ready.
```

This means the people services are running and awaiting requests.
Warnings will be present in the startup output until database integration has
been completed.

**For now TMI People runs in memory alone.**

For more detailed output, run people with the verbose switch:

```
node people -v
```


### Testing people

Fire up postman and import the
[test collection](people/testing.postman_collection.json) at:
```
people/testing.postman_collection.json
```

You may start up the test runner in postman and execute the whole TMI collection
, or fire them seperately as examples of requests to direct at the people
services. Note that the tests are not idempotent and some will fail on
subsequent test runs.

**It is best to restart people before running the whole suite again**.


### Stopping people

In the terminal where people is running simply press CTRL-C to terminate the
process.

The output should be:
```
^C Kill command received:

Retiring / endpoint... done.
Retiring /agreement endpoint... done.
Retiring /collective endpoint... done.
Retiring /post endpoint... done.
Retiring /profile endpoint... done.
Retiring /user endpoint... done.
Retiring /agreement/administrator endpoint... done.
Retiring /agreement/moderator endpoint... done.
Retiring /agreement/member endpoint... done.
Retiring /agreement/guest endpoint... done.
Retiring /post/article endpoint... done.
Retiring /post/comment endpoint... done.

TMI People is done.
```

## Applications


### Administration

Admin is the first of the client applications and is meant to be a low level
administration of the people elements. It has begun to be implemented using
[Angular](https://angular.io/).

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

Social networking app that authenticates, represents connects and collects
participants.


### Groud Zero

Realtime monitoring app of interactive statistics and trends.


### Events

Event organisation app, that allows scheduling, coordination and participation.


### Incidents

Incident app that logs, disseminates and escalates.


### Web

Website that educates, informs and promotes projects, collectives, initiatives
and events.


### Inventory

Manage, track and trace assets and inventory.


### Projects

Create and collaborate.


## TODO

* Complete People API readme.
* Complete access and permission checking of sub- agreements and posts in
  People.
* Implement database stash for People.
* Update Admin readme.
* Complete Admin
* Complete request test set in Postman.
* Expand tests to inlude invalid requests.
* Develop client applications.

