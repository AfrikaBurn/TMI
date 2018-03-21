/**
 * @file UserService.js
 * Permission aware User management and query service.
 */

"use strict"


const
  RestfulService = require('../../core/services/RestfulService'),
  UNAUTHORISED = { error: "Unauthorised", code: 401, expose: true }


class UserService extends RestfulService {


  // ----- Method responders


  /**
   * Get the User schema, find or list Users
   * @inheritDoc
   */
  get(request, response){
    switch(true){
      case request.header('Content-Type') == 'application/json;schema':
      case request.user && request.user.id === 0:
        return super.get(request,response)
      case !request.user:
        throw UNAUTHORISED
      default:
        return super.get(request, response).map(
          (subject) => { this.privacyFilter(request.user, subject) }
        )
    }
  }

  /**
   * Create user
   * @inheritDoc
   */
  post(request, response){
    switch(true){
      case request.user && request.user.id === 0:
      // TODO add user admin collective
      case !request.user:
        return super.post(request, response)
      default:
        throw UNAUTHORISED
    }
  }

  /**
   * Update user
   * @inheritDoc
   */
  put(request, response){
    switch(true){
      case request.user && request.user.id === 0:
      // TODO add user admin collective
      case request.user && request.body && request.user.id == request.body.id:
        return super.put(request, response)
      default:
        throw UNAUTHORISED
    }
  }

  /**
   * Update user
   * @inheritDoc
   */
  patch(request, response){
    switch(true){
      case request.user && request.user.id === 0:
      // TODO add user admin collective
      case request.user && request.body && request.user.id == request.body.id:
        return super.put(request, response)
      default:
        throw UNAUTHORISED
    }
  }

  /**
   * Delete user
   * @inheritDoc
   */
  delete(request, response){
    switch(true){
      case request.user && request.user.id === 0:
      // TODO add user admin collective
      case request.user && request.body && request.user.id == request.body.id:
        return super.delete(request, response)
      default:
        throw UNAUTHORISED
    }
  }


  // ----- Utility -----


  /**
   * Apply privacy
   */
  privacyFilter(user, subject){
    // TODO: apply propper privacy
    return { username: subject.username }
  }

}


module.exports = UserService