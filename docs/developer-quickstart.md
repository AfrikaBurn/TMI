# Developer quickstart

## Clone the repository

Within a terminal:

```
git clone --recurse-submodules https://github.com/AfrikaBurn/TMI.git
```

This creates a TMI folder with the source code for coponents:

TMI\
├─ components\
│   ├─ administration\
│   ├─ tribe\
│   ├─ people\
│   ├─ projects\
│   ├─ events\
│   ├─ incidents\
│   ├─ groundzero\
│   ├─ inventory\
│   └─ web\
├─ docs\
└─ [README.md](../README.md)


## Development tools used
Our current in house development toolset is here as a suggestion to help get people on board and developing as quickly as possible. This does not imply we support or receive funding from any of these tools. If you more comfortable in other tools please feel free to use them.

All software used is free

### Development OS
Ubuntu or an Ubuntu flavour

Long term stable, 18.04 or higher

### Visual Studio
https://linuxize.com/post/how-to-install-visual-studio-code-on-ubuntu-18-04/

Version 1.31.1 or later

### Postman
https://www.getpostman.com

Once download you will need to register the software

Version 6.7.4 or later

### Nodejs
https://github.com/nodesource/distributions/blob/master/README.md

Version 11.10.1

<hr />

## Installation
Within a terminal, got to the components/people folder, then type:
```
npm install
```

## Running people

Within a terminal, in the TMI directory:
```
node components/people
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
Warnings will be present in the startup output until database integration has been completed.


**For now TMI People runs in memory alone.**

For more detailed output, run people with the verbose switch:

```
node components/people -v
```

## Test People

Fire up postman and on the "File" menu select "Import" and then import the [test collection](https://github.com/AfrikaBurn/tmi-people/blob/master/testing.postman_collection.json) at:
```
components/people/testing.postman_collection.json
```

![Postman screenshot](./images/Postman-import.png)

Ensure you select collections on the left-hand side menu.

Then click on the right arrow next to "tmi people".

![Postman screenshot](./images/Postman-collections.png)

From the popout menu select "run":

![Postman screenshot](./images/Postman-run.png)

This will generate a list of all current system test and whether or not they passed or failed.

You will be able to look at each call and see what was sent and the response from the server.

![Postman screenshot](./images/Postman-results.png)

You may start up the test runner in postman and execute the whole TMI collection, or fire them separately as examples of requests to direct at the people services. Note that the tests are not idempotent and some will fail on subsequent test runs.

It is best to restart people before running the whole suite again.
