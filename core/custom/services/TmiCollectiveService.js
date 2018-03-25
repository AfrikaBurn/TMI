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
   * Write complete user
   * @inheritDoc
   */
  put(request, response){
    switch(true){
      case request.user.isAdministrator:
      case request.user.isAuthenticated && this.isOwnCollective(request):
        return super.put(request, response)
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID
    }
  }

  /**
   * Write partial user
   * @inheritDoc
   */
  patch(request, response){
    switch(true){
      case request.user.isAdministrator:
      case request.user.isAuthenticated && this.isOwnCollective(request):
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
      case request.user.isAuthenticated && this.isOwnCollective(request):
        return super.delete(request, response)
      case request.user.isAnonymous: throw Service.FORBIDDEN
      default: throw Service.INVALID
    }
  }
}


// ----- Response types -----


module.exports = TmiCollectiveService