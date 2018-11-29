
# Processors

> A processor maps routes or URLs to middleware and/or functions that perform
operations on a request, through the implementation of its routes() function.


## Anatomy of a processor

Consider the most basic execute processor:

```js
/**
 * @file foobar.execute.js
 * An example processor.
 */
"use strict"

class FoobarExecutor extends core.processors.Processor {

  /**
   * @param  {string} path path of the current endpoint ("/foobar" in this case).
   * @return {object} middleware mapping, keyed by path and method
   */
  routes(path){
    return {
      [path]: {
        'get': [
          Processor.PARSE_QUERY,
        ],
        'post': [
          Processor.PARSE_BODY,
          (req, res) => { utility.log('A post request!'); }
        ],
        'put': [],
        'all': [
          (req, res) => { utility.log('All requests!'); }
        ],
      }
    }
  }

  /**
   * Process a GET request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  get(req, res) {
    return
      'Hello world! ' +
      req.query.name
        ? 'Hello ' + req.query.name + '!'
        : ''
  }

  /**
   * Process a POST request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  post(req, res) {
    return
      'Yes world! ' +
      req.body.name
        ? 'Yes ' + req.body.name + '!'
        : ''
  }

  /**
   * Process a PUT request.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  put(req, res) {
    throw Processor.FORBIDDEN
  }
}

module.exports = FoobarExecutor
```

The name of the class "FoobarExecutor" does not really matter and is mainly used
to set the module.exports variable.

What is significant is that FoobarExecutor extends
[core.processors.Processor](../base/processors/Processor.js). This base class
provides the means to bind middleware to any HTTP request method (post, get,
put, patch, delete) as well as to any class method with the same name.

### Middleware mapping

>  Middleware may be any function that takes a request and response object as arguments.

Mapping is defined by the return value from the processor's `routes()` method:
```js
    {
      [path]: {
        'get': [
          Processor.PARSE_QUERY,
        ],
        'post': [
          Processor.PARSE_BODY,
          (req, res) => { utility.log('A post request!'); }
        ],
        'put': [],
        'all': [
          (req, res) => { utility.log('All requests!'); }
        ],
      }
    }
```
This instructs MiniMi to:
1. Respond to requests at the path of this processor.
   > It is possible to respond to other paths using a string like **"/foo"** in
   stead of **[path]** in special cases.
1. Specifically respond to **get**, **post**, **put** and **all** requests,
   meaning that if this processor defines a `get()`, `post()`, `put()` or
   `all()` method, execute it after the specified middleware.
   >Whenever a request is processed and no response is generated, a **404** will
   be generated.
1. Apply the **PARSE_QUERY** middleware provided by the Processor base class to
   **get** requests before executing the `get()` method, if it exists.
1. Apply the **PARSE_BODY** middleware provided by the Processor base class, as
   well as a custom function that logs "A post request!", to **post**
   requests before executing the `post()` method, if it exists.
1. Apply no particular middleware to **put** requests, but execute its
   corresponding `put()` method, if it exists.
1. Apply a custom function that logs "All requests!" to **all** requests and
   execute its corresponding `all()` method, if it exists.

## Predefined processors


### [RestStashProcessor](../base/processors/RestStashProcessor.js)

> Maps all HTTP methods to sensible middleware as well as the corresponding
processor methods already implemented to handle persistance using the stash
defined for the endpoint.

To assign a RestStashProcessor to an endpoint (usually the execute phase) create a
file within the endpoint folder, named:

```[endpoint-folder-name].[phase].js```

eg. in the "foo" folder, create "foo.execute.js" with content:

```js
/**
 * @file foo.execute.js
 * Foo executor.
 */
"use strict"

class FooExecutor extends core.processors.RestStashProcessor {}

module.exports = FooExecutor
```

### [AccessProcessor](../base/processors/AccessProcessor.js)

> Extends RestStashProcessor and overrides all methods to provide access control.
Grants access to al methods by default.

To assign an AccessProcessor to an endpoint (usually the access phase) that
allows any get request, but denies all post requests, create a file within the
endpoint folder, named:

```[endpoint-folder-name].[phase].js```

eg. in the "foo" folder, create "foo.access.js" with content:

```js
/**
 * @file FooAccess.js
 * Foo access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class FooAccess extends AccessProcessor {

  /**
   * @inheritDoc
   * This get() implementation is strictly not neccessary and for demonstration
   * purposes only, as all methods are granted by default anyway.
   */
  get(req, res){
    AccessProcessor.GRANT(req) // Grant access to any GET requests
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    AccessProcessor.DENY(req) // Deny access to all POST requests
  }
}


module.exports = CollectiveAccess