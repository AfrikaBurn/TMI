/**
 * @file TmiUserService.js
 * Permission aware User management and query service.
 */

"use strict"


const
  Service = require('../../core/services/Service'),
  UserService = require('../../core/services/UserService')


class TmiUserService extends UserService {


  // ----- Request Loading -----


  /**
   * Prepare to process a get request
   * @inheritDoc
   */
  getLoad(request, response){
    request.affected = this.minion.stash.read(
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
        console.log(user.positionality)
        return super.getRoute(request, response)
      case user.is.anonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID_REQUEST
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
        throw Service.FORBIDDEN
      default: throw Service.INVALID_REQUEST
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
      case user.is.anonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID_REQUEST
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
      case user.is.anonymous: throw Service.FORBIDDEN
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
      case user.is.anonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID_REQUEST
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
      entities = this.minion.stash.read(request).entities,
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


module.exports = TmiUserService