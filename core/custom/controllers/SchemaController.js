/**
 * @file SchemaController.js
 * Schema controller.
 */

"use strict"


const
  Controller = require('./Controller'),
  Service = require('../../core/Service')


class SchemaController extends Controller {


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
  createSubService(schemaDef){

    var name = schemaDef.name.toLowerCase()

    this.services[name] = new Service(
      this.service.path + '/' + name,
      {
        schema: {
          name: name,
          schema: typeof schemaDef.schema == 'string'
            ? JSON.parse(schemaDef.schema)
            : schemaDef.schema
        },
        controller: 'Controller',
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
          (schemaDef) => this.createSubService(schemaDef)
        )

        return super.postRoute(req, res)

      case user.is.anonymous:
        throw Controller.FORBIDDEN
      default: throw Controller.INVALID_REQUEST
    }
  }
}


module.exports = SchemaController