/**
 * @file TmiUserController.js
 * Permission aware User management and query controller.
 */

"use strict"


const
  Controller = require('../../core/controllers/Controller'),
  UserController = require('../../core/controllers/UserController')


class TmiUserController extends UserController {


  // ----- Request Loading -----


  /**
   * Load affected user IDs
   * @inheritDoc
   */
  getLoad(request, response){
    request.affected = this.nano.stash.read(
      request.user,
      request.query,
      false,
      ['id']
    )
  }


  // ----- Request Routing -----


  /**
   * Get the User schema, find or list Users
   * @inheritDoc
   */
  getRoute(request, response){

    var user = request.user

    switch(true){
      case request.header('Content-Type') == 'application/json;schema':
      case user.is.super:
      case user.is.authenticated && user.isOwner:
        return super.getRoute(request, response)
      case user.is.authenticated:
        return super.getRoute(request, response)
      case user.is.anonymous: throw Controller.FORBIDDEN
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
      case user.is.super:
      case user.is.anonymous /*&& request.body.length == 1*/:
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
      case user.is.super:
      case user.is.authenticated && this.isOwnUser(request):
        return super.putRoute(request, response)
      case user.is.anonymous: throw Controller.FORBIDDEN
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
      case user.is.super:
      case user.is.authenticated:
        return super.patchRoute(request, response)
      case user.is.anonymous: throw Controller.FORBIDDEN
      default: throw INVALID_REQUEST
      }
  }

  /**
   * Delete user
   * @inheritDoc
   */
  deleteRoute(request, response){

    var user = request.user

    switch(true){
      case user.is.super:
      case user.is.authenticated && this.isOwnUser(request):
        return super.deleteRoute(request, response)
      case user.is.anonymous: throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
      }
  }


  // ----- Utility -----


  /**
   * Sets the ownership positionality of the user accross entities. Ownership is
   * recognised only if all entities are owned by the requesting user.
   * @param {HttpRequest} request
   */
  position(request){

    var
      entities = this.nano.stash.read(request).entities,
      user = request.user

    user.isOwner = true;
    entities.forEach(
      (entity, index) => {
        user.isOwner &= user.positionality[index].isOwner =
          user.id == entity.id
      }
    )
  }

  /**
   * Apply privacy
   */
  privatise(positionality, response){
    // response[1].forEach(
    //   (entity, index) => {
    //     entity.email = positionality[index]['is' + entity.email.privacy]
    //       ? entity.email
    //       : '*'
    //   }
    // )
  }
}


// ----- Response types -----


module.exports = TmiUserController