/**
 * @file load.js
 * Collective loading.
 */
"use strict"


const
  passport = require('passport'),
  expressSession = require('express-session'),
  Processor = core.processors.Processor


class CollectiveLoader extends Processor{


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
   * Load request target collectives.
   * @inheritDoc
   */
  get(req, res){
    this.loadTargetCollectives(req)
  }


  /* ----- Utility ----- */


  /**
   * Load target collectives IDs, ownership, deference and exposure.
   * @param  {object} req Express request object
   */
  loadTargetCollectives(req){

    req.target = req.target || {}

    req.target.collectives = this.endpoint.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id', 'owner', 'defer', 'exposure']
      }
    ).entities

    req.target.collectives.forEach(
      (collective) => {
        collective.deferred = {
          moderation: this.loadDeferanceChain(
            req.user,
            collective,
            'moderation'
          ),
          administration: this.loadDeferanceChain(
            req.user,
            collective,
            'administration'
          )
        }
      }
    )
  }


  /**
   * Get the deferred administration or moderation chain of a collective.
   * @param {object} user Requesting user.
   * @param {object} collective Collective to trace.
   * @param {string} type Deference type to trace [administrator|moderator].
   */
  loadDeferanceChain(user, collective, type){

    var deferedTo = [collective.id]

    if (collective.defer && collective.defer[type]) {
      deferedTo.concat(
        this.loadDeferanceChain(
          user,
          this.endpoint.stash.read(
            user,
            {id: collective.defer[type].id},
            {
              process: false,
              fields: ['id', 'defer']
            }
          ).entities[0],
          type
        )
      )
    }

    return deferedTo
  }
}


module.exports = CollectiveLoader