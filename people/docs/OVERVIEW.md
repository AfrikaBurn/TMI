
# MiniMi - Overview


## Introduction

MiniMi uses minimal [configuration](./CONFIGURATION.md) and these simple
conventions to define microservices:

* A set of [URL endpoints](#url-endpoints) defined by the folder structure of
  the endpoint folder.
* Endpoint requests handled in [phases](#phased-processing) by
  [processor](#processors) objects defined within each folder.
* State persistance using datastores [stash](#stashes) defined within a folder,
  or its nearest ancestor, using the state schema specified in the folder.


## Configuration

A minimal set of [global settings](./CONFIGURATION.md) may be found in the
[config.js](../config.js) file and controls the service name, port, processing
phases, whitelisted clients and custom configuration data for endpoints.

The default configuration:

```
{
  "name": "MiniMi",
  "port": 3000,
  "phases": ['load', 'access', 'execute']
}
```


## URL endpoints

> Within the installation root the endpoint folder determines URL endpoints
through its structure.

This structure for example:

```
endpoints
 ├─ foo
 │   └─ bar
 └─ foobar
```

Will create URL enpoints at:

```
/
/foo
/foo/bar
/foobar
```

## Phased processing

>Each request to an endpoint is processed in phases that may be customised within
the [configuration](../config.json) file. These phases will be executed in order
and all of the matching endpoint processors defined for a phase will be executed
before the next phase commences.


The default phases are intended to **load** resources, determine whether the
requestor has **access** to the resource and **execute** the required actions if
so.


## Processors

>A processor maps routes or URLs to middleware and/or functions that perform
operations on a request, through the implementation of its routes() function.

At each endpoint a processor may be defined per phase, for example:

```
endpoints
 ├─ foo
 │   ├─ bar
 │   │   ├─ bar.load.js
 │   │   ├─ bar.access.js
 │   │   └─ bar.execute.js
 │   ├─ foo.load.js
 │   └─ foo.execute.js
 ├─ foobar
 │   └─ foobar.execute.js
 └─ endpoint.load.js
 ```

Where:
* **/foo/bar** has a processor for each defined phase,
* **/foo** has load and execute processors,
* **/foobar** only has an execute processor, while
* **/** only has a load processor.

[More on processors](./PROCESSORS.md)


## Stashes

> A stash represents a standard way to read, write, update and delete data
records and serves as a means to abstract data storage technologies.

