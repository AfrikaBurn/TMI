/**
 * @file CollectiveAccess.js
 * Collective access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class CollectiveAccess extends AccessProcessor {


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  get(req, res){
    // TODO
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.is.anonymous
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    // TODO
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    // TODO
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    // TODO
  }
}


module.exports = CollectiveAccess