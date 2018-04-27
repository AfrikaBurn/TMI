/**
 * @file UserAccess.js
 * User access processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class UserAccess extends core.processors.RestProcessor {


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  get(req, res){
    if (
      req.header('Content-Type') != 'application/json;schema' &&
      req.user.is.anonymous
    ) throw Processor.FORBIDDEN
  }

  /**
   * @inheritDoc
   */
  post(req, res){
    if (
      req.user.is.anonymous && req.body.length > 1
    ) throw Processor.FORBIDDEN
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    if (
      req.user.is.anonymous ||
      !(req.user.is.owner || req.user.is.administrator)
    ) throw Processor.FORBIDDEN
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    if (
      req.user.is.anonymous ||
      !(req.user.is.owner || req.user.is.administrator)
    ) throw Processor.FORBIDDEN
  }
}


module.exports = UserAccess