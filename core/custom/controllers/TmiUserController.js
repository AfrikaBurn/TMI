/**
 * @file TmiUserController.js
 * User Controller.
 */

"use strict"


const
  Controller = require('../../core/controllers/Controller'),
  UserController = require('../../core/controllers/UserController')


class TmiUserController extends UserController {


  // ----- Process -----


  /**
   * Create system users.
   */
  install(){
    ['Anonymous', 'Administrator'].forEach(
      (label, index) => {
        if (this.service.stash.read({}, {id: index}).pop().length == 0){
          console.log(TmiUserController.CREATING, label)
          this.service.stash.create(
            {id: 1},
            [TmiUserController.SYSTEM_ACCOUNTS[index]]
          )
        }
      }
    )
  }


  // ----- Request Loading -----


  /**
   * Load affected user IDs.
   * @inheritDoc
   */
  getLoad(request, response){

    var user = request.user

    request.targets = this.service.stash.read(
      request.user,
      request.query,
      {
        process: false,
        fields: ['id']
      }
    ).pop()

  }


  // ----- Request Modification -----


  /**
   * @inheritDoc
   */
  modifiers(){
    return {
      [this.service.path]: {'get': []}
    }
  }

  /**
   * Establish owner positionality.
   * @inheritDoc
   */
  getModify(request, response){

    var
      user = request.user,
      owner = true

    user.position = user.position || []

    Object.keys(request.targets).forEach(
      (target, index) => {
        user.position[index] = {
          owner: user.id === target.id || user.is.administrator
        }
        owner &= user.position[index]
      }
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
      case user.is.administrator:
      case user.is.authenticated:
        return super.getRoute(request, response)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
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
      case user.is.anonymous && request.body.length == 1:
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
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
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
      case user.is.administrator:
      case user.is.authenticated && user.postion.owner:
        return super.deleteRoute(request, response)
      case user.is.anonymous: throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }
}


// ----- Log Messages -----


TmiUserController.CREATING = '    Created \x1b[1m%s\x1b[0m user.'


// ----- System Accounts -----


TmiUserController.SYSTEM_ACCOUNTS = [
  {
    'username': 'Anonymous', 'password': 'none',
    'email': { 'value': 'no-reply@system.com', 'privacy': 'owner'}
  },
  {
    'username': 'Administrator', 'password': 'Administrator',
    'email': { 'value': 'no-reply@system.com', 'privacy': 'owner'}
  }
]



module.exports = TmiUserController