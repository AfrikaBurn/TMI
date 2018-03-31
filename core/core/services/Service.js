/**
 * @file Controller.js
 * A basic controller for a single path with the means to map, attach and detach
 * HTTP method calls to handler functions by the same name.
 */

"use strict"


const

  bodyParser = require('body-parser'),
  Stash = require('../stashes/Stash')


class Controller {


  // ----- Process -----


  /**
   * Creates a new Controller
   * @param  {object} nano NanoService that contains this controller nano object.
   */
  constructor(nano){
    this.nano = nano
    this.attach()
  }

  /**
   * Attaches phase routers to load, modify and route functions
   */
  attach(){
    this.attachRouter('Load', this.loaders())
    this.attachRouter('Modify', this.modifiers())
    this.attachRouter('Route', this.routes())
  }


  // ----- Request Loading -----


  /**
   * Maps preloading middleware and handlers to routes.
   * @return {object} middleware mapping keyed by method:
   *
   * {
   *   '': {
   *     'method': []
   *   },
   *   [this.path]: {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   *   'path/to/bind/to': {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   * }
   * Method may be any of [get|post|put|delete|...] or 'use' to bind to all
   * methods.
   * Controller object methods with the same name as a method (get(), post(), etc.)
   * will automatically be bound to [this.path] with a corresponding method
   * declaration.
   */
  loaders(){
    return {}
  }


  // ----- Request Modifying -----


  /**
   * Maps modifying middleware and handlers to routes.
   * @return {object} middleware mapping keyed by method:
   *
   * {
   *   '': {
   *     'method': []
   *   },
   *   [this.path]: {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   *   'path/to/bind/to': {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   * }
   * Method may be any of [get|post|put|delete|...] or 'use' to bind to all
   * methods.
   * Controller object methods with the same name as a method (get(), post(), etc.)
   * will automatically be bound to [this.path] with a corresponding method
   * declaration.
   */
  modifiers(){
    return {}
  }


  // ----- Request Routing -----


  /**
   * Maps route middleware and handlers to routes.
   * @return {object} middleware mapping keyed by method:
   *
   * {
   *   '': {
   *     'method': []
   *   },
   *   [this.path]: {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   *   'path/to/bind/to': {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   * }
   * Method may be any of [get|post|put|delete|...] or 'use' to bind to all
   * methods.
   * Controller object methods with the same name as a method (get(), post(), etc.)
   * will automatically be bound to [this.path] with a corresponding method
   * declaration.
   */
  routes(){
    return {}
  }


  // ----- Method utilities -----


  /**
   * Attach handlers to routers according to the map.
   * @param  {string} name Name of the router.
   */
  attachRouter(name, map){

    var
      pathes = Object.keys(map),
      router = this.service.bootstrap.routers[name.toLowerCase()]

    pathes.forEach(
      (path) => {
        for (let method in map[path]){

          map[path][method].forEach(
            (middleware) => router[method]('/' + path, middleware)
          )

          if (path == this.service.path && this[method + name]){
            router[method]('/' + path,
              (request, response, next) => {
                var result = this[method + name](request, response)
                if (result) {
                  response.send(
                    Object.assign(
                      Stash.clone(result[0]),
                      {entities: result[1] || []}
                    )
                  )
                } else next()
              }
            )
          }
        }
      }
    )
  }
}


// ----- Middleware -----


Controller.PARSE_BODY  = bodyParser.json()
Controller.PARSE_QUERY = bodyParser.urlencoded({ extended: false })
Controller.CONSOLE_LOG = function consoleLog(request, response, next) {
  console.log('Processing: ' + request.url)
  console.log('Accept: ' + request.header('Accept'))
  console.log('Content-Type: ' + request.header('Content-Type'))
  console.log('Query:', request.query)
  console.log('Body:', request.body ,'\n')
  next()
}


// ----- Response types -----


Controller.INVALID_REQUEST = { error: "Invalid request", code: 400, expose: true }
Controller.FORBIDDEN = { error: "Forbidden to unauthorised users", code: 403, expose: true }
Controller.SUCCESS = { status: "Success", code: 200 }


module.exports = Controller