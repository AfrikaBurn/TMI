/**
 * @file UserAccess.js
 * User access processor.
 */
"use strict"


const
  Processor = require('./Processor'),
  RestProcessor = require('./RestProcessor')


class AccessProcessor extends RestProcessor {

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
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  put(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  patch(req, res){
    AccessProcessor.GRANT(req)
  }

  /**
   * @inheritDoc
   */
  delete(req, res){
    AccessProcessor.GRANT(req)
  }
}


AccessProcessor.GRANT = (req) => {
  if (req.header('Content-Type') == 'application/json;access') {
    throw Processor.SUCCESS
  }
}

AccessProcessor.DENY = (req) => {
  throw Processor.FORBIDDEN
}


module.exports = AccessProcessor