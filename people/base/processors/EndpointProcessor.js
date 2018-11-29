/**
 * @file EndpointProcessor.js
 * A processor for dynamic endpoints.
 */
"use strict"


const
  RestStashProcessor = require('./RestStashProcessor')


class EndpointProcessor extends RestStashProcessor {


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