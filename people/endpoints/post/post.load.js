/**
 * @file load.js
 * Post loading.
 */
"use strict"


class PostLoader extends core.processors.Processor{


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
            this.loadTargetPosts(req)
            next()
          }
        ]
      }
    }
  }


  /* ----- Utility ----- */


  /**
   * Load request target post IDs and owners.
   * @param {object} req Express request object
   */
  loadTargetPosts(req){

    req.target = req.target || {}

    req.target.posts = this.endpoint.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id', 'owner']
      }
    ).entities

    req.exising = req.exising || {}


  }
}


module.exports = PostLoader