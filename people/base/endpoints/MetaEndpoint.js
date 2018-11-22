/**
 * @file MetaEndpoint.js
 * A base endpoint controller.
 */
"use strict"


const
  Endpoint = require('./Endpoint')


class MetaEndpoint extends Endpoint{


  /* ----- Construction ----- */


  /**
   * @inheritDoc
   */
  constructor(name, parent, url = false, source = false, schema = false){
    super(name, parent, url, source, schema)
    this.endpoints = {}
  }


  /* ----- Loading ----- */


  /**
   * @inheritDoc
   */
  loadChildren(){
    this.stash.read({id: -1}, {fields: ['name', 'schema']}).entities.forEach(
      (child) => {
        this.createSubEndpoint(child)
      }
    )
  }


  /* ----- Utility ----- */


  /**
   * Creates a new subendpoint.
   * @param {object} endpointDefinition endpoint definition in the form:
   * {
       name: [machine name],
       schema: [schema definition JSON string or object]
      }
   */
  createEndpoint(endpointDefinition){

    var name = endpointDefinition.name
      .toLowerCase()
      .replace(/[^a-z0-9\-\.]/,
        '-'
      )

    this.endpoints[name] = new Endpoint(
      name,
      this,
      false,
      this.source + '/default',
      endpointDefinition.schema
    )
  }
}


module.exports = MetaEndpoint