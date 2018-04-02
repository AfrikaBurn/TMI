/**
 * @file TmiSchemaController.js
 * Schema controller.
 */

"use strict"


const
  TmiController = require('./TmiController'),
  Service = require('../../core/Service')


class TmiSchemaController extends TmiController {


  // ----- Process -----


  /**
   * @inheritDoc
   */
  constructor(service){
    super(service)
    this.services = {}
  }

  /**
   * Create a Schema subservice
   * @param {object} definition Schema definition
   */
  createSubService(definition){

    var name = definition.name.toLowerCase()

    this.services[name] = new Service(
      this.service.path + '/' + name,
      {
        schema: {
          name: name,
          definition: typeof definition.schema == 'string'
            ? JSON.parse(definition.schema)
            : definition.schema
        },
        controller: 'TmiController',
        stash: this.service.config.stash
      },
      this.service.bootstrap,
      4
    )
  }


  // ----- Request Routing -----


  /**
   * Create schema.
   * @inheritDoc
   */
  postRoute(req, res){

    var user = req.user

    switch(true){
      case user.is.administrator:
      case user.is.authenticated:

        req.body.forEach(
          (definition) => this.createSubService(definition)
        )

        return super.postRoute(req, res)

      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }
}


module.exports = TmiSchemaController