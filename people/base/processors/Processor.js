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
   * @param {object} endpoint Endpoint this processor belongs to.
   */
  constructor(endpoint){
    this.endpoint = endpoint
  }


  /* ----- Routing ----- */


  /**
   * Maps middleware and handlers to routes.
   * @param  {string} path        path of the current endpoint.
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
   * Method may be any of [get|post|put|delete|...] or 'all' to bind to all
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
  routes(path){ return {} }


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

          var routerMethod = method == 'all'
            ? 'use'
            : method

          routeMap[route][method].forEach(
            (middleware) => router[routerMethod](route, middleware)
          )

          if (route == path && this[method]){
            router[routerMethod](route,
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
Processor.LOG_REQUEST = function consoleLog(req, res, next) {
  utility.log('Processing '+ req.method + ': ' + req.url)
  next()
}


// ----- Response Types -----


Processor.INVALID_REQUEST = { error: "Invalid request", code: 400, expose: true }
Processor.SUCCESS = { status: "Success", code: 200, expose: true }
Processor.FORBIDDEN = {
  error: "Forbidden to unauthorised users", code: 403, expose: true
}


module.exports = Processor