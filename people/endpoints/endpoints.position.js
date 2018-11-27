/**
 * @file endpoint.position.js
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
        'all': [
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
    bootstrap.endpoints['/agreement'].agreedPositions(
      [req.user],
      ['administrator', 'moderator', 'member', 'guest']
    )
  }
}


module.exports = RootPosition