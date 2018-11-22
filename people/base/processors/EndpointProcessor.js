/**
 * @file EndpointProcessor.js
 * A processor for dynamic endpoints.
 */
"use strict"


const
  RestProcessor = require('./RestProcessor'),
  Endpoint = require('../endpoints/Endpoint')


class EndpointProcessor extends RestProcessor {


  /* ----- Method responders ----- */


  /** Creates a new subendpoint as per provided endpoint definition within the
   * request body.
   * @inheritDoc
   */
  post(req, res) {

    req.body.forEach(
      (endpointDefinition) => this.endpoint.createEndpoint(endpointDefinition)
    )

    return super.post(req, res)
  }
}


module.exports = EndpointProcessor