/**
 * @file JSONTestService.js
 * Basic configurable object.
 */

"use strict"


const
  Service = require('../Service')


class JSONTestService extends Service {

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
    return request.header('Content-Type') == 'application/json;schema'
      ? this.minion.schema
      : JSON.stringify(request.query)
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


module.exports = JSONTestService