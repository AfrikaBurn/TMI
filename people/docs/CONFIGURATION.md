
# MiniMi Configuration

MiniMi is configured using [config.json](../config.json) in the root of the
install and is a JSON object with the following properties:


## "name"

Name of the microservice. A string that is used within the terminal output and
may be used by endpoint processors.

> Defaults to: "MiniMi"


## "port"

Port number that the microservice listens on for requests.

> Defaults to: 3000


## "phases"

An array of strings representing the phases that this microservice will use to
process requests. There is no real limit to the number of phases, though the
following should be considered reserved words and
**not be used as phase names**:

```
endpoint
schema
stash
```

> Defaults to: ```['load', 'access', 'execute']```


## Endpoints

Configuration passed to specific endpoints keyed by endpoint path.

> Defaults to Null

Endpoint configuration is accessible to all the processors of the endpoint
through its ```this.endpoint.config``` property.


## Whitelist

An array containing hosts that may connect to this endpoint, for example:

```json
  "whitelist": [
    "http://localhost:4200",
    "https://www.foobar.com"
  ]
```
> Defaults to Null


## Example config.json

```json
{
  "name": "Foo Bar Core",
  "port": 3000,

  "phases": ["load", "prepare", "position", "access", "filter", "execute"],

  "endpoints": {
    "/": {
      "someProp": "SomeValue"
    },
    "/foo": {
      "anotherProp": "AnotherValue",
    },
    "/foo/bar": {
      "yetAnotherProp": true,
      "AndYetAnotherProp": 1000,
    }
  },

  "whitelist": [
    "http://localhost:4200",
    "https://www.foobar.com"
  ]
}
```