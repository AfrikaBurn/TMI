/**
 * @file CollectiveAccess.js
 * Collective access processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class CollectiveAccess extends core.processors.RestProcessor {


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
    if (req.user.is.anonymous) throw Processor.FORBIDDEN
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
  delete(req, res){
    // TODO
  }
}


module.exports = CollectiveAccess