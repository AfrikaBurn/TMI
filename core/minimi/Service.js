/**
 * @file Service.js
 * Basic configurable object.
 */

"use strict"


const
  jsonSchemaForm = require('json-schema-form-js'),
  bodyParser = require('body-parser'),
  parseBody = bodyParser.json(),
  parseQuery = bodyParser.urlencoded({ extended: false }),
  logRequest = (request, response) => { console.log('Processing: ' + request.url) }


module.exports = class Service {

  /**
   * Creates a new Service
   * @param  {object} minion Minion that contains this service minion object.
   */
  constructor(minion){
    this.minion = minion
    this.attach()
  }

  /**
   * Declare methods to respond to and middleware to apply to each
   * @return object middleware mapping keyed by method
   */
  methods(){
    return {
      'get': [parseQuery],
      'post': [parseBody],
      'put': [parseBody],
      'delete': [parseQuery],
      'patch': [parseQuery, parseBody]
    }
  }


  // ----- Method utilities -----


  /**
   * Attach request method responders
   */
  attach(){

    var
      methods = this.methods(),
      router = this.minion.minimi.router,
      path = this.minion.getConfig().path || this.minion.getConfig().schema

    for (let method in methods){
      if (this[method]){

        for (let middleware in methods[method]){
          this.minion.minimi.router[method](
            '/' + path,
            methods[method][middleware]
          )
        }

        this.minion.minimi.router[method](
          '/' + path,
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
   * Releases all path handlers.
   */
  detach(){

    var
      routes = this.minion.minimi.router.stack,
      path = '/' + (this.minion.getConfig().path || this.minion.getConfig().schema),
      keys = Object.keys(routes).reverse()

    for(var i in keys){
      if(routes[keys[i]].route.path == path){
        routes.splice(
          keys[i],
          1
        )
      }
    }
  }


  // ----- Method responders


  /**
   * Process a GET request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  get(request, response) {
    switch(request.header('Accept')){
      case 'application/json;schema': return this.minion.schema
      case 'application/json': return JSON.stringify(request.query)
      default: return jsonSchemaForm.render(this.minion.schema)
    }
  }

  /**
   * Process a POST request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  post(request, response) {
    return JSON.stringify(request.body)
  }

  /**
   * Process a PUT request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  put(request, response) {
    return JSON.stringify(request.body)
  }

  /**
   * Process a DELETE request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  delete(request, response) {
    return JSON.stringify(request.query)
  }

  /**
   * Process a PATCH request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  patch(request, response) {
    return JSON.stringify([request.query, request.body])
  }
}