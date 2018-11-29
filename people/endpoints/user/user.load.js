/**
 * @file load.js
 * User loading.
 */
"use strict"


class UserLoader extends core.processors.Processor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'all': [
          core.processors.Processor.PARSE_QUERY,
          (req, res, next) => {
            this.loadTargetUsers(req)
            next()
          }
        ]
      }
    }
  }


  /* ----- Utility ----- */


  /**
   * Load request target user IDs.
   * @param {object} req Express request object
   */
  loadTargetUsers(req){

    req.target = req.target || {}

    req.target.users = this.endpoint.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id']
      }
    ).entities
  }
}


module.exports  = UserLoader