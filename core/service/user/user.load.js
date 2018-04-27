/**
 * @file load.js
 * User loading.
 */
"use strict"


const
  passport = require('passport'),
  expressSession = require('express-session'),
  Processor = core.processors.Processor


class UserLoader extends Processor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'get': [Processor.PARSE_QUERY]
      }
    }
  }


  /* ----- Method responders ----- */


  /**
   * Load request target user IDs.
   * @inheritDoc
   */
  get(req, res){
    this.loadTargetUsers(req)
  }


  /* ----- Utility ----- */


  /**
   * Load target user IDs.
   * @param  {object} req Express request object
   */
  loadTargetUsers(req){

    req.target = req.target || {}

    req.target.users = this.service.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id']
      }
    ).entities
  }
}


module.exports = UserLoader