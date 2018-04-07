/**
 * @file CoreRestfulController.js
 * Basic RESTful controller for basic HTTP methods.
 */

"use strict"


const
  CoreController = require('./CoreController')


class CoreRestfulController extends CoreController {


  // ----- Request Loading -----


  /**
   * @inheritDoc
   */
  loaders(){
    return {
      [this.service.path]: {
        'get': [CoreController.PARSE_QUERY],
        'post': [CoreController.PARSE_BODY],
        'put': [CoreController.PARSE_BODY],
        'delete': [CoreController.PARSE_QUERY],
        'patch': [CoreController.PARSE_QUERY, CoreController.PARSE_BODY]
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


module.exports = CoreRestfulController