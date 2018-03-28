/**
 * @file TmiCollectiveService.js
 * Permission aware Collective management and query service.
 */

"use strict"


const
  RestfulService = require('../../core/services/RestfulService')


class TmiCollectiveService extends RestfulService {


  // ----- Method responders


  /**
   * Get the Collective schema, find or list Collectives
   * @inheritDoc
   */
  getRoute(request, response){

    var user = request.user

    switch(true){
      case request.header('Content-Type') == 'application/json;schema':
      case user.isSuper:
      case user.isAuthenticated:
      case user.isAnonymous:
        return super.getRoute(request, response)
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
      case user.isSuper:
      case user.isAuthenticated:
        return super.postRoute(request, response)
      case user.isAnonymous:
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
      case user.isSuper:
      case user.isAuthenticated && (user.isOwner || user.isAdministrator):
        return super.putRoute(request, response)
      case user.isAnonymous:
        throw Service.FORBIDDEN
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
      case user.isSuper:
      case user.isAuthenticated && (user.isOwner || user.isAdministrator):
        return super.patchRoute(request, response)
      case user.isAnonymous:
        throw Service.FORBIDDEN
      default: throw Service.INVALID_REQUEST
    }
  }

  /**
   * Delete user
   * @inheritDoc
   */
  deleteRoute(request, response){

    var user = request.user

    switch(true){
      case user.isSuper:
      case user.isAuthenticated && (user.isOwner || user.isAdministrator):
        return super.deleteRoute(request, response)
      case user.isAnonymous:
        throw Service.FORBIDDEN
      default: throw Service.INVALID_REQUEST
    }
  }
}


// ----- Response types -----


module.exports = TmiCollectiveService