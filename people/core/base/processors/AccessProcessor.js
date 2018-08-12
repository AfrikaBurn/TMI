/**
 * @file UserAccess.js
 * User access processor.
 */
"use strict"


const
  Processor = require('./Processor'),
  RestProcessor = require('./RestProcessor')


class AccessProcessor extends RestProcessor {}


AccessProcessor.GRANT = (req) => {
  if (req.header('Content-Type') == 'application/json;access') {
    throw Processor.SUCCESS
  }
}

AccessProcessor.DENY = (req) => {
  throw Processor.FORBIDDEN
}


module.exports = AccessProcessor