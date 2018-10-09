/**
 * @file UserAccess.js
 * User access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class UserAccess extends AccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.header('Content-Type') != 'application/json;schema' &&
    req.user.is.anonymous
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    (req.user.is.anonymous && req.body.length > 1) ||
    (req.user.is.authenticated && !req.user.is.administrator)
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    req.user.is.anonymous ||
    !(req.user.is.owner || req.user.is.administrator)
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    req.user.is.anonymous ||
    !(req.user.is.owner || req.user.is.administrator)
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    req.user.is.anonymous ||
    !(req.user.is.owner || req.user.is.administrator)
      ? AccessProcessor.DENY(req)
      : AccessProcessor.GRANT(req)
  }
}


module.exports = UserAccess