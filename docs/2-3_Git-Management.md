# TMI - Tribe Mobilisation Infrastructure
# Git Management

## Introduction

TMI is an open source platform designed with the intent to have multiple collaborators from multiple communities working on the project. Each microservice is separated to limit any negative impact to the entire architecture, should one break.

The core system is the database management system. It has numerous test case that can be tested with postman before being deployed to a live environment. Currently over 250 test cases.

* [Read more](./2-1_INSTALL.md)

## Contributing
 
Contributing is broken into 4 major groups:

* (Patch Builder)[#]
* (New developer)[#]
* (Committed developer)[#]
* (Breakaway branch)[#]

## Patch Builders
Patch builders are people that when working with the system spot a small problem and build a simple patch to fix it. Once complete they submit the patch against a bug or feature request. When it has been tested it will be added to the master branched by one of the committed developers.

Creating a patch:

1) Follow the [installation guide](./2-1_INSTALL.md) to get up and working

2) Make and test your changes

3) Commit them 
~~~
git commit -m "Add patch notes here"
~~~

4) Upload the patch to the relevant microservice, against the bug or feature request.

## New developer

If you are a new developer, you may not want to over-commit yourself while figuring out the code. You can simply clone the micro-services you wish to work on then work on your local. If you build your own microservice or have a large commit to make when you ready, you can do that to your own branch.

You can then notify the main branch of the microservice, and one of the commited developers with test it and merge it.

**Creating your own branch**

1) Follow the [installation guide](./2-1_INSTALL.md) to get up and working.

2) 

## Committed developer

## Breakaway branch



To check out the whole of TMI including its submodules:

```
git clone --recurse-submodules https://github.com/AfrikaBurn/TMI.git
```

NOTE:

You may need to pull the latest submodules after cloning.

```
git pull --recurse-submodules
```

Or alternatively, the various components may be checked out individually as per repository links in sections below:
* [People](#people)
* [Administration](#administration)
* [Tribe](#tribe)
* [Projects](#projects)
* [Events](#events)
* [Incidents](#incidents)
* [Ground Zero](#ground-zero)
* [Inventory](#inventory)
* [Web](#web)