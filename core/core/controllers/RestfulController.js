/**
 * @file RestfulController.js
 * Basic RESTful controller for basic HTTP methods.
 */

"use strict"


const
  Controller = require('./Controller')


class RestfulController extends Controller {


  // ----- Request Loading -----


  /**
   * @inheritDoc
   */
  loaders(){
    return {
      [this.nano.path]: {
        'get': [Controller.PARSE_QUERY],
        'post': [Controller.PARSE_BODY],
        'put': [Controller.PARSE_BODY],
        'delete': [Controller.PARSE_QUERY],
        'patch': [Controller.PARSE_QUERY, Controller.PARSE_BODY]
      }
    }
  }


  // ----- Request Modifying -----


  /**
   * @inheritDoc
   */
  modifiers(){
    return {
      [this.nano.path]: {
        'get': [],
        'post': [],
        'put': [],
        'delete': [],
        'patch': []
      }
    }
  }


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  routes(){
    return {
      [this.nano.path]: {
        'get': [],
        'post': [],
        'put': [],
        'delete': [],
        'patch': []
      }
    }
  }


  // ----- Method responders


  /**
   * Process a GET request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  getRoute(request, response) {
    return request.header('Content-Type') == 'application/json;schema'
      ? [Controller.SUCCESS, this.nano.schema]
      : this.nano.stash.read(request.user, request.query)
  }

  /**
   * Process a POST request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  postRoute(request, response) {
    return this.nano.stash.create(request.user, request.body)
  }

  /**
   * Process a PUT request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  putRoute(request, response) {
    return this.nano.stash.update(request.user, request.query, request.body)
  }

  /**
   * Process a PATCH request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  patchRoute(request, response) {
    return this.nano.stash.update(request.user, request.query, request.body)
  }

  /**
   * Process a DELETE request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  deleteRoute(request, response) {
    return this.nano.stash.delete(request.user, request.query)
  }
}


module.exports = RestfulController