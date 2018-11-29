/**
 * @file AgreementAccess.js
 * Agreement access processor.
 */
"use strict"


const
  AccessProcessor = core.processors.AccessProcessor


class AgreementAccess extends AccessProcessor {

  /**
   * @inheritDoc
   */
  get(req, res){
    req.user.is.authenticated
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY(req)
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    req.user.is.authenticated
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    // TODO: Revisioning for existing
    req.user.is.owner || req.user.is.administrator
      ? AccessProcessor.GRANT(req)
      : AccessProcessor.DENY(req)
  }
}


module.exports = AgreementAccess