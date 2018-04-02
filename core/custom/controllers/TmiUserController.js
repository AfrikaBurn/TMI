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
  getLoad(req, res){

    var user = req.user

    req.targets = this.service.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id']
      }
    ).pop()

  }


  // ----- Request Modification -----


  /**
   * Establish ownership and positionality.
   * @inheritDoc
   */
  getModify(req, res){

    var
      user = req.user,
      position = {
        owner: true,
        moderator: true,
        administrator: true
      }

    user.position = user.position || []

    req.targets.forEach(

      (target, index) => {

        user.position[index] = {
          owner: user.id === target.id,
          member: user.positions.member.filter(
            (collection) => target.memberships.indexOf(collection) != -1
          ).length > 0,
          moderator: user.positions.moderator.filter(
            (collection) => target.memberships.indexOf(collection) != -1
          ).length > 0,
          administrator: user.positions.administrator.filter(
            (collection) => target.memberships.indexOf(collection) != -1
          ).length > 0
        }

        position = {
          owner: position.owner &&
            user.position[index].owner,
          moderator: position.moderator &&
            user.position[index].moderator,
          administrator: position.administrator &&
            user.position[index].administrator,
        }
      }
    )

    Object.assign(
      user.position,
      position
    )
  }


  // ----- Request Routing -----


  /**
   * Get the User schema, find or list Users
   * @inheritDoc
   */
  getRoute(req, res){

    var user = req.user

    switch(true){
      case req.header('Content-Type') == 'application/json;schema':
      case user.is.administrator:
      case user.is.authenticated:
        return super.getRoute(req, res)
      case user.is.anonymous:
        throw Controller.FORBIDDEN
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
      case user.is.anonymous && req.body.length == 1:
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
      case user.is.anonymous: throw Controller.FORBIDDEN
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
      case user.is.anonymous: throw Controller.FORBIDDEN
      default: throw INVALID_REQUEST
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
      case user.is.anonymous: throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }
}


// ----- Log Messages -----


TmiUserController.CREATING =
  '\x1b[37m    Creating \x1b[0m%s\x1b[37m user.'


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