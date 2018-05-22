/**
 * @file root.position.js
 * Loads requesting user agreed positions.
 */
"use strict"


class RootPosition extends core.processors.UniformProcessor {

  /**
   * @inheritDoc
   */
  routes(path){
    return {
      '': {
        'use': [
          (req, res, next) => {
            this.process(req, res)
            next()
          }
        ]
      }
    }
  }

  /* ----- Method responders ----- */


  /**
   * Loads requesting user positions.
   * @inheritDoc
   */
  process(req, res) {
    bootstrap.services['/agreement'].agreedPositions(
      [req.user],
      ['administrator', 'moderator', 'member', 'guest']
    )
  }
}


module.exports  = RootPosition