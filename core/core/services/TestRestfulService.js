/**
 * @file TestRestfulController.js
 * Restful controller that logs and echoes request parameters and body.
 */

"use strict"


const
  Controller = require('./Controller')


class TestRestfulController extends Controller {


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  routes(){
    return {
      [this.path]: {
        'get': [Controller.PARSE_QUERY, Controller.CONSOLE_LOG],
        'post': [Controller.PARSE_BODY, Controller.CONSOLE_LOG],
        'put': [Controller.PARSE_BODY, Controller.CONSOLE_LOG],
        'delete': [Controller.PARSE_QUERY, Controller.CONSOLE_LOG],
        'patch': [Controller.PARSE_QUERY, Controller.PARSE_BODY, Controller.CONSOLE_LOG]
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
    return request.header('Content-Type') == 'application/json;schema'
      ? this.service.schema
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
   * Process a PATCH request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  patch(request, response) {
    return JSON.stringify([request.query, request.body])
  }

  /**
   * Process a DELETE request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  delete(request, response) {
    return JSON.stringify(request.query)
  }
}


module.exports = TestRestfulController