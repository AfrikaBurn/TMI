# TMI - Tribe Mobilisation Infrastructure
# Example Code

## Introduction

TMI uses a microservices architecture, so microservice can be built completely stand-alone and in the language the developer chooses. There is a default centralised database to handle all API calls and user access permissions. 

The system is designed so that the user need only build the front end and let the api handle all database structural calls. This means faster render times and less need to completely rebuild pages.

It is considered bad form for the server to directly call the API and render the data. As this allows for man in the middle attacks and can bypass user permissions. 

You will need to have a working version of the database access controller "People" installed, or set up the "API Converter."

* [Read more](./2-1_INSTALL.md)

## Very Simple example
 

## Login example
