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
   * @param  {object} service Service that contains this controller.
   */
  constructor(service){
    this.service = service
    this.attach()
  }

  /**
   * Performs installation tasks.
   */
  install(){
    console.log('    \x1b[37mNothing to do.\x1b[0m')
  }

  /**
   * Attaches load, modify and route routers to
   * load, modify and route middleware and handler functions.
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
   * methods. Controller object methods named [method]Modify will automatically
   * be bound to [this.path] with a corresponding method declaration, after any
   * middleware. Eg:
   * {
   *   [this.path]: {
   *     get: [...],
   *     post: [...]
   *   }
   * }
   * Will map reqs to:
   * getModify(req, res, next){ ... }
   * postModify(req, res, next){ ... }
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
   * methods. Controller object methods named [method]Modify will automatically
   * be bound to [this.path] with a corresponding method declaration, after any
   * middleware. Eg:
   * {
   *   [this.path]: {
   *     get: [...],
   *     post: [...]
   *   }
   * }
   * Will map reqs to:
   * getModify(req, res, next){ ... }
   * postModify(req, res, next){ ... }
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
   * methods. Controller object methods named [method]Route will automatically
   * be bound to [this.path] with a corresponding method declaration, after any
   * middleware. Eg:
   * {
   *   [this.path]: {
   *     get: [...],
   *     post: [...]
   *   }
   * }
   * Will map reqs to:
   * getRoute(req, res, next){ ... }
   * postRoute(req, res, next){ ... }
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
              (req, res, next) => {
                var result = this[method + name](req, res)
                if (result) {
                  res.send(
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
Controller.CONSOLE_LOG = function consoleLog(req, res, next) {
  console.log('Processing: ' + req.url)
  console.log('Accept: ' + req.header('Accept'))
  console.log('Content-Type: ' + req.header('Content-Type'))
  console.log('Query:', req.query)
  console.log('Body:', req.body ,'\n')
  next()
}


// ----- Response types -----


Controller.INVALID_REQUEST = {
  error: "Invalid req", code: 400, expose: true
}
Controller.FORBIDDEN = {
  error: "Forbidden to unauthorised users", code: 403, expose: true
}
Controller.SUCCESS = { status: "Success", code: 200 }



module.exports = Controller