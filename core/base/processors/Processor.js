/**
 * @file Processor.js
 * Basic processor template.
 */
"use strict"


const
  fs = require('fs'),
  bodyParser = require('body-parser')


class Processor {


  /* ----- Construction ----- */


  /**
   * Constructs a new Processor.
   * @param {object} service Service this processor belongs to.
   */
  constructor(service){
    this.service = service
  }


  /* ----- Routing ----- */


  /**
   * Maps middleware and handlers to routes.
   * @param  {string} path        path of the current service.
   * @param  {string} controller  controller of the current service.
   * @return {object}             middleware mapping keyed by method:
   *
   * {
   *   '': {
   *     'method': []
   *   },
   *   [path]: {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   *   'path/to/bind/to': {
   *     'method': [ middleWare, ...],
   *     ...
   *   }
   * }
   * Method may be any of [get|post|put|delete|...] or 'use' to bind to all
   * methods. Processor methods named for http methods will
   * automatically be bound to [path] if it has a method declaration, after any
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
  routes(path, controller){ return {} }


  /**
   * Attach handlers to routers according to the processor map.
   * @param {string}  path    Path to attach to.
   * @param {object}  router  Router to attach to.
   */
  attach(path, router){

    var
      routeMap = this.routes(path),
      routes = Object.keys(routeMap)

    routes.forEach(
      (route) => {
        for (let method in routeMap[route]){

          routeMap[route][method].forEach(
            (middleware) => router[method](route, middleware)
          )

          if (route == path && this[method]){
            router[method](route,
              (req, res, next) => {
                res.data =  this[method](req, res, next)
                if (res.data !== false) next()
              }
            )
          }
        }
      }
    )
  }
}


// ----- Shared Middleware -----


Processor.PARSE_BODY  = bodyParser.json()
Processor.PARSE_QUERY = bodyParser.urlencoded({ extended: false })
Processor.LOGGER = function consoleLog(req, res, next) {
  core.log('Processing: ' + req.url)
  core.log('Accept: ' + req.header('Accept'))
  core.log('Content-Type: ' + req.header('Content-Type'))
  core.log('Query:', req.query)
  core.log('Body:', req.body ,'\n')
  next()
}


// ----- Response Types -----


Processor.INVALID_REQUEST = { error: "Invalid request", code: 400, expose: true }
Processor.SUCCESS = { status: "Success", code: 200, expose: true }
Processor.FORBIDDEN = {
  error: "Forbidden to unauthorised users", code: 403, expose: true
}

module.exports = Processor