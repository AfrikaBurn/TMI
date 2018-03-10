/**
 * @file JSONService.js
 * Basic configurable object.
 */

"use strict"


const
  Service = require('../Service'),
  jsonSchemaForm = require('json-schema-form-js')


class JSONService extends Service {

  /**
   * Declare methods to respond to and middleware to apply to each
   * @return object middleware mapping keyed by method
   */
  methods(){
    return {
      'get': [Service.PARSE_QUERY, Service.CONSOLE_LOG],
      'post': [Service.PARSE_BODY, Service.CONSOLE_LOG],
      'put': [Service.PARSE_BODY, Service.CONSOLE_LOG],
      'delete': [Service.PARSE_QUERY, Service.CONSOLE_LOG],
      'patch': [Service.PARSE_QUERY, Service.PARSE_BODY, Service.CONSOLE_LOG]
    }
  }


  // ----- Method responders


  /**
   * Process a GET request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  get(request, response) {
    switch(request.header('Content-Type')){
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


module.exports = JSONService