/**
 * @file RestfulService.js
 * Basic RESTful service for basic HTTP methods.
 */

"use strict"


const
  Service = require('./Service')


class RestfulService extends Service {


  // ----- Request Loading -----


  /**
   * @inheritDoc
   */
  loaders(){
    return {
      [this.minion.path]: {
        'get': [Service.PARSE_QUERY],
        'post': [Service.PARSE_BODY],
        'put': [Service.PARSE_BODY],
        'delete': [Service.PARSE_QUERY],
        'patch': [Service.PARSE_QUERY, Service.PARSE_BODY]
      }
    }
  }


  // ----- Request Modifying -----


  /**
   * @inheritDoc
   */
  modifiers(){
    return {
      [this.minion.path]: {
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
      [this.minion.path]: {
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
      ? [Service.SUCCESS, this.minion.schema]
      : this.minion.stash.read(request.user, request.query)
  }

  /**
   * Process a POST request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  postRoute(request, response) {
    return this.minion.stash.create(request.user, request.body)
  }

  /**
   * Process a PUT request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  putRoute(request, response) {
    return this.minion.stash.update(request.user, request.query, request.body)
  }

  /**
   * Process a PATCH request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  patchRoute(request, response) {
    return this.minion.stash.update(request.user, request.query, request.body)
  }

  /**
   * Process a DELETE request
   * @param  object request  Express request object
   * @param  object response Express response object
   */
  deleteRoute(request, response) {
    return this.minion.stash.delete(request.user, request.query)
  }
}


module.exports = RestfulService