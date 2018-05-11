/**
 * @file RootPosition.js
 * Agreement pre positioning.
 */
"use strict"


class RootPosition extends core.processors.PositionProcessor {

  /**
   * @inheritDoc
   */
  routes(path){
    return {
      '': {
        'use': [
          (req, res, next) => {
            this.position(req, res)
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
  position(req, res) {
    core.services.agreement.agreedPositions(
      [req.user],
      ['administrator', 'moderator', 'member', 'guest']
    )
  }
}


module.exports = RootPosition