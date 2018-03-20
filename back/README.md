# minimi

minimal microservices


## System requirements

1. NodeJS


## Install

In the root of minimi, run:
```
npm install
```


## Configure

minimi exposes a microservice per minion declared in
[config.json](./config.json).

```
{
	"name": "minimi",
	"port": 3000,

	"minions": {

		"Example": {
			"service": "ExampleServiceName"
			"stash":   "ExampleStashName",
			"schema":  "ExampleSchemaName",
		}

	}
}
```


## Extend

TODO

## Start

From the folder containing minimi, run:
```
node minimi
```
