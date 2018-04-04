/**
 * @file TmiUserController.js
 * User Controller.
 */

"use strict"


const
  http = require('http'),
  Controller = require('../../core/controllers/Controller'),
  UserController = require('../../core/controllers/UserController'),
  Stash = require('../../core/stashes/Stash'),
  TmiStash = require('../stashes/TmiStash')


class TmiUserController extends UserController {


  // ----- Process -----


  /**
   * Create system users.
   */
  install(){
    ['Anonymous', 'Administrator'].forEach(
      (label, index) => {
        if (this.service.stash.read({}, {id: index}).entities.length == 0){
          console.log(TmiUserController.CREATING, label)
          this.service.stash.create(
            {id: 1},
            [TmiUserController.SYSTEM_ACCOUNTS[index]]
          )
        }
      }
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
        return super.getRoute(req, res)
      case user.is.administrator:
      case user.is.authenticated:
        var users = this.service.stash.read(user, req.query)
        return users
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
    ).entities

  }


  // ----- Request Modification -----


  /**
   * Establish ownership and positionality.
   * @inheritDoc
   */
  getModify(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      moderator: true,
      administrator: true,
      on: []
    }

    req.targets.forEach(

      (target, index) => {

        user.position.on[index] = {
          owner: user.id == target.id || user.is.administrator,
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

        user.position.owner &= user.position.on[index].owner
        user.position.moderator &= user.position.on[index].moderator
        user.position.administrator &= user.position.on[index].administrator
      }
    )

    user.position.owner = Boolean(user.position.owner)
    user.position.moderator = Boolean(user.position.moderator)
    user.position.administrator = Boolean(user.position.administrator)
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