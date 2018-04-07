/**
 * @file Controller.js
 * TMI base controller.
 */

"use strict"


const
  CoreRestfulController = require('../../core/controllers/CoreRestfulController')


class Controller extends CoreRestfulController {


  // ----- Method responders


  /**
   * Get the Collective schema, find or list Collectives
   * @inheritDoc
   */
  getRoute(req, res){

    var user = req.user

    switch(true){
      case req.header('Content-Type') == 'application/json;schema':
      case user.is.administrator:
      case user.is.authenticated:
      case user.is.anonymous:
        return super.getRoute(req, res)
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Create user
   * @inheritDoc
   */
  postRoute(req, res){

    var user = req.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated:
        return super.postRoute(req, res)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Write complete user
   * @inheritDoc
   */
  putRoute(req, res){

    var user = req.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.putRoute(req, res)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Write partial user
   * @inheritDoc
   */
  patchRoute(req, res){

    var user = req.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.patchRoute(req, res)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }

  /**
   * Delete user
   * @inheritDoc
   */
  deleteRoute(req, res){

    var user = req.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.deleteRoute(req, res)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }
}


module.exports = Controller