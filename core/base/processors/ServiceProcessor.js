/**
 * @file ServiceProcessor.js
 * A processor for dynamic services.
 */
"use strict"


const
  RestProcessor = require('./RestProcessor'),
  Service = require('../services/Service')


class ServiceProcessor extends RestProcessor {


  /* ----- Method responders ----- */


  /** Creates a new subservice as per provided service definition within the
   * request body.
   * @inheritDoc
   */
  post(req, res) {

    req.body.forEach(
      (serviceDefinition) => this.service.createSubService(serviceDefinition)
    )

    return super.post(req, res)
  }
}


module.exports = ServiceProcessor