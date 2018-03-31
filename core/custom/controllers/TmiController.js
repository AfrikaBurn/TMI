/**
 * @file TmiController.js
 * TMI base controller.
 */

"use strict"


const
  RestfulController = require('../../core/controllers/RestfulController')


class TmiController extends RestfulController {


  // ----- Method responders


  /**
   * Get the Collective schema, find or list Collectives
   * @inheritDoc
   */
  getRoute(request, response){

    var user = request.user

    switch(true){
      case request.header('Content-Type') == 'application/json;schema':
      case user.is.administrator:
      case user.is.authenticated:
      case user.is.anonymous:
        return super.getRoute(request, response)
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Create user
   * @inheritDoc
   */
  postRoute(request, response){

    var user = request.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated:
        return super.postRoute(request, response)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Write complete user
   * @inheritDoc
   */
  putRoute(request, response){

    var user = request.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.putRoute(request, response)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Write partial user
   * @inheritDoc
   */
  patchRoute(request, response){

    var user = request.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.patchRoute(request, response)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Delete user
   * @inheritDoc
   */
  deleteRoute(request, response){

    var user = request.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.deleteRoute(request, response)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }
}


module.exports = TmiController