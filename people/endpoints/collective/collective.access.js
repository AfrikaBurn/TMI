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
    AccessProcessor.GRANT(req)
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
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }
}


module.exports = CollectiveAccess