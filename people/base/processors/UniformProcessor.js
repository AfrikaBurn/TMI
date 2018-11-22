/**
 * @file UniformProcessor.js
 * Basic uniform processor for basic HTTP methods.
 */
"use strict"


const
  RestProcessor = require('./RestProcessor')


class UniformProcessor extends RestProcessor {


  /* ----- Request Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'all': [],
      }
    }
  }


  /* ----- Method responders ----- */


  /**
   * @inheritDoc
   */
  all(req, res) {
    this.process(req, res)
  }


  /* ----- Positionality calculation ----- */


  /**
   * Default request processor.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  process(req, res){}
}


module.exports = UniformProcessor