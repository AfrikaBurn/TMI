/**
 * @file TmiUserService.js
 * Permission aware User management and query service.
 */

"use strict"


const
  Service = require('../../core/services/Service'),
  UserService = require('../../core/services/UserService')


class TmiUserService extends UserService {


  // ----- Method responders


  /**
   * Get the User schema, find or list Users
   * @inheritDoc
   */
  get(request, response){
    switch(true){
      case request.header('Content-Type') == 'application/json;schema':
      case request.user.isAdministrator: return super.get(request,response)
      case request.user.isAuthenticated:
        return super.get(request, response).map(
          (subject) => this.privacyFilter(request.user, subject)
        )
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID
    }
  }

  /**
   * Create user
   * @inheritDoc
   */
  post(request, response){
    switch(true){
      case request.user.isAdministrator:
      case request.user.isAnonymous: return super.post(request, response)
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID
    }
  }

  /**
   * Update user
   * @inheritDoc
   */
  put(request, response){
    switch(true){
      case request.user.isAdministrator:
      case request.user.isAuthenticated && this.isOwnUser(request):
        return super.put(request, response)
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID
    }
  }

  /**
   * Update user
   * @inheritDoc
   */
  patch(request, response){
    switch(true){
      case request.user.isAdministrator:
      case request.user.isAuthenticated && this.isOwnUser(request):
        return super.put(request, response)
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw INVALID
      }
  }

  /**
   * Delete user
   * @inheritDoc
   */
  delete(request, response){
    switch(true){
      case request.user.isAdministrator:
      case request.user.isAuthenticated && this.isOwnUser(request):
        return super.delete(request, response)
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID
      }
  }


  // ----- Utility -----


  /**
   * Tests whether the operation is being performed on the current user
   * @param {HttpRequest} request
   */
  isOwnUser(request){
    return request.body && request.user.id == request.body.id
  }

  /**
   * Apply privacy
   */
  privacyFilter(user, subject){
    return {
      username: subject.username,
      email: user['is' + subject.email.privacy] ? subject.email.value : false
    }
  }
}


// ----- Response types -----


module.exports = TmiUserService