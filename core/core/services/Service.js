/**
 * @file Service.js
 * A basic service for a single path with the means to map, attach and detach
 * HTTP method calls to handler functions by the same name.
 */

"use strict"


const

  bodyParser = require('body-parser')


class Service {


  // ----- Process -----


  /**
   * Creates a new Service
   * @param  {object} minion Minion that contains this service minion object.
   */
  constructor(minion){
    this.minion = minion
    this.path = this.minion.getConfig().path || this.minion.getConfig().schema
    this.attach()
  }


  // ----- Declaration -----


  /**
   * Declare middleware and responders.
   * @return {object} middleware mapping keyed by method:
   *
   * {
   *   '': {
   *     'method': []
   *   }
   *   'path/to/bind/to': {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   * }
   * Method may be any of [get|post|put|delete|...] or 'use' to bind to all
   * methods.
   * Service Object methods with the same name as a method (get(), post(), etc.)
   * will automatically be bound to any path with a corresponding method
   * declaration.
   */
  routing(){
    return {}
  }


  // ----- Method utilities -----


  /**
   * Attach request method responders
   */
  attach(){

    var
      router = this.minion.minimi.router,
      routing = this.routing(),
      pathes = Object.keys(routing)

    for (let index in pathes){
      var path = pathes[index]
      for (let method in routing[pathes[index]]){

        for (let middleware in routing[path][method]){
          this.bindMiddleware(path, method, routing[path][method][middleware])
        }

        this.bindResponder(path, method,
          (request, response) => {
            var result = this[method](request, response)
            if (result){
              response.send(result)
            }
          }
        )
      }
    }
  }

  /**
   * Binds a middleware handler to a path and method.
   * @param {string} path         Path to bind middleware to.
   * @param {method} method       Method on path to bind middleware to.
   * @param {Function} middleware Middleware handler to bind to path and method.
   */
  bindMiddleware(path, method, middleware){
    path === ""
      ? this.minion.minimi.router[method](middleware)
      : this.minion.minimi.router[method]('/' + this.path, middleware)
  }

  /**
   * Binds a responder function to a path and method.
   * @param {string} path         Path to bind middleware to.
   * @param {method} method       Method on path to bind responder to.
   * @param {Function} responder  Responder to bind to path and method.
   */
  bindResponder(path, method, responder){
    if (this[method]){
      this.bindMiddleware(path, method, responder)
    }
  }

  /**
   * Releases all path handlers.
   */
  detach(){

    var
      path = '/' + this.path,
      routes = this.minion.minimi.router.stack,
      keys = Object.keys(routes).reverse()

    for(var i in keys){
      if(routes[keys[i]].route && routes[keys[i]].route.path == path){
        routes.splice(
          keys[i],
          1
        )
      }
    }
  }


  // ----- Utilities -----



}


// ----- Middleware -----


Service.PARSE_BODY  = bodyParser.json()
Service.PARSE_QUERY = bodyParser.urlencoded({ extended: false })
Service.CONSOLE_LOG = function consoleLog(request, response, next) {
  console.log('Processing: ' + request.url)
  console.log('Accept: ' + request.header('Accept'))
  console.log('Content-Type: ' + request.header('Content-Type'))
  console.log('Query:', request.query)
  console.log('Body:', request.body ,'\n')
  next()
}


module.exports = Service