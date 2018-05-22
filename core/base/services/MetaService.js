/**
 * @file MetaService.js
 * A base service controller.
 */
"use strict"


const
  Service = require('./Service')


class MetaService extends Service{


  /* ----- Construction ----- */


  /**
   * @inheritDoc
   */
  constructor(name, parent, url = false, source = false, schema = false){
    super(name, parent, url, source, schema)
    this.services = {}
  }


  /* ----- Loading ----- */


  /**
   * @inheritDoc
   */
  loadChildren(){
    this.stash.read({id: -1}, {fields: ['name', 'schema']}).entities.forEach(
      (child) => {
        this.createSubService(child)
      }
    )
  }


  /* ----- Utility ----- */


  /**
   * Creates a new subservice.
   * @param {object} serviceDefinition service definition in the form:
   * {
       name: [machine name],
       schema: [schema definition JSON string or object]
      }
   */
  createSubService(serviceDefinition){

    var name = serviceDefinition.name
      .toLowerCase()
      .replace(/[^a-z0-9\-\.]/,
        '-'
      )

    this.services[name] = new Service(
      name,
      this,
      false,
      this.source + '/default',
      serviceDefinition.schema
    )
  }
}


module.exports = MetaService