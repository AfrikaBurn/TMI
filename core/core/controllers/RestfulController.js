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
      [this.service.path]: {
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
      [this.service.path]: {
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
      [this.service.path]: {
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
   * @param  object req  Express request object
   * @param  object res Express response object
   */
  getRoute(req, res) {
    return req.header('Content-Type') == 'application/json;schema'
      ? this.service.schema
      : this.service.stash.read(req.user, req.query)
  }

  /**
   * Process a POST request
   * @param  object req  Express request object
   * @param  object res Express response object
   */
  postRoute(req, res) {
    return this.service.stash.create(req.user, req.body)
  }

  /**
   * Process a PUT request
   * @param  object req  Express request object
   * @param  object res Express response object
   */
  putRoute(req, res) {
    return this.service.stash.update(req.user, req.query, req.body)
  }

  /**
   * Process a PATCH request
   * @param  object req  Express request object
   * @param  object res Express response object
   */
  patchRoute(req, res) {
    return this.service.stash.update(req.user, req.query, req.body)
  }

  /**
   * Process a DELETE request
   * @param  object req  Express request object
   * @param  object res Express response object
   */
  deleteRoute(req, res) {
    return this.service.stash.delete(req.user, req.query)
  }
}


module.exports = RestfulController