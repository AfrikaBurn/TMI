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
        'get':    [],
        'post':   [],
        'put':    [],
        'patch':  [],
        'delete': []
      }
    }
  }


  /* ----- Method responders ----- */


  /**
   * @inheritDoc
   */
  get(req, res) {
    this.process(req, res)
  }

  /**
   * @inheritDoc
   */
  post(req, res) {
    this.process(req, res)
  }

  /**
   * @inheritDoc
   */
  put(req, res) {
    this.process(req, res)
  }

  /**
   * @inheritDoc
   */
  patch(req, res) {
    this.process(req, res)
  }

  /**
   * @inheritDoc
   */
  delete(req, res) {
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