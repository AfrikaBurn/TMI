/**
 * @file JSONService.js
 * Basic service that includes all HTTP methods.
 */

"use strict"


const
  Service = require('../Service')


class JSONService extends Service {

  /**
   * Declare methods to respond to and middleware to apply to each
   * @return object middleware mapping keyed by method
   */
  methods(){
    return {
      'get': [Service.PARSE_QUERY],
      'post': [Service.PARSE_BODY],
      'put': [Service.PARSE_BODY],
      'delete': [Service.PARSE_QUERY],
      'patch': [Service.PARSE_QUERY, Service.PARSE_BODY]
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
      : this.minion.stash.read(request.body)
  }

  /**
   * Process a POST request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  post(request, response) {
    return this.minion.stash.create(request.body)
  }

  /**
   * Process a PUT request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  put(request, response) {
    return this.minion.stash.update(request.query, request.body)
  }

  /**
   * Process a DELETE request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  delete(request, response) {
    return this.minion.stash.delete(request.query)
  }

  /**
   * Process a PATCH request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  patch(request, response) {
    return this.minion.stash.update(request.query, request.body)
  }
}


module.exports = JSONService