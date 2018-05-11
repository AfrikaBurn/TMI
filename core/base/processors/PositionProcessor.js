/**
 * @file PositionProcessor.js
 * Basic Positional processor for basic HTTP methods.
 */
"use strict"


const
  Processor = require('./Processor')


class PositionProcessor extends Processor {


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
    this.position(req, res)
  }

  /**
   * @inheritDoc
   */
  post(req, res) {
    this.position(req, res)
  }

  /**
   * @inheritDoc
   */
  put(req, res) {
    this.position(req, res)
  }

  /**
   * @inheritDoc
   */
  patch(req, res) {
    this.position(req, res)
  }

  /**
   * @inheritDoc
   */
  delete(req, res) {
    this.position(req, res)
  }


  /* ----- Positionality calculation ----- */


  /**
   * Default positionality calculator.
   * @param  {object} req Express request object
   * @param  {object} res Express response object
   */
  position(req, res){}
}


module.exports = PositionProcessor