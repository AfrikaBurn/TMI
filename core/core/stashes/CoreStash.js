/**
 * @file CoreStash.js
 * Basic Data Storage CoreStash.
 */

"use strict"


const
  Ajv = require('ajv'),
  passwordHash = require('password-hash')


class CoreStash {


  // ----- Process -----


  /**
   * Creates a new data stash.
   * @param  {object} Service Parent Service object.
   */
  constructor(service){
    this.service = service
    CoreStash.VALIDATOR.addSchema(service.schema, service.config.schema)
  }

  /**
   * Performs installation tasks.
   */
  install(){}

  /**
   * Closes the data stash.
   * @return {boolean}  True if close is successfull, false if not.
   */
  close(){
    return true;
  }

  /**
   * Returns a passport compatible session store version of this stash.
   * @return {object}
   */
  toSessionStore(){
    console.log(
      '    \x1b[33mWARNING: Using memory based stash for session storage.\n' +
      '             \x1b[33mIt will fail with multiple connections!\n' +
      '             \x1b[33mUse another stash for production.'
    );
    return undefined;
  }


// ----- Storage -----


  /**
   * Create entities.
   * @param  {object} user User creating the entities.
   * @param  {array} entities Array of data entities to create.
   * @return {array} Data     Array of entities that were created successfully.
   */
  create(user, entities){

    this.validate(entities)

    // Commit entities here

    this.process(entities, 'comitted')

    return CoreStash.response(CoreStash.CREATED, entities)
  }

  /**
   * Read entities matching the provided criteria.
   * @param  {object} user User reading the entities.
   * @param  {object} criteria Partial entity to match.
   * @param  {object} options Options to apply:
   *                  fields: an optional array of field names to fetch.
   *                  process: boolean whether to apply schema processing.
   *                  schemas: optional
   * @return {array} Array of matching entities.
   */
  read(user, criteria, options = {}){

    var
      fields = options.fields || false,
      process = options.process != undefined ? options.process : true

    // Read entities here
    var entities = criteria

    if (process) this.process(entities, 'retrieved')

    return CoreStash.response(CoreStash.SUCCESS, entities)
  }

  /**
   * Update entities matching the provided criteria with the properties from
   * partial.
   * @param  {object} user User updating the entities.
   * @param  {object} criteria  Partial entity to match.
   * @param  {object} partial   Partial entity to apply update from.
   * @return {array}            Array of updated entities
   */
  update(user, criteria){

    //TODO: partially validate
    this.validate(entities)

    // Make changes here

    this.process(entities, 'retrieved')

    return CoreStash.response(CoreStash.SUCCESS, entities)
  }

  /**
   * Delete all entities matching the provided criteria.
   * @param  {object} user User deleting the entities.
   * @param  {object} criteria Partial entity to match.
   * @return {array}           Array of deleted entities
   */
  delete(user, criteria){

    // Delete here
    var entities = criteria

    this.process(entities, 'deleted')

    return CoreStash.response(CoreStash.SUCCESS, entities)
  }


// ----- Validation -----


  /**
   * Validate an array of entities against the stash schema.
   * @param {array} entities
   */
  validate(entities){

    if (!Array.isArray(entities)) throw CoreStash.error(
      CoreStash.INVALID,
      ["Array expected"]
    )

    var errors = []

    this.process(entities, 'raw')

    entities.forEach(
      (entity, index) => {
        if (
          !CoreStash.VALIDATOR.validate(
            this.service.config.schema,
            entity
          )
        ) errors[index] = CoreStash.normaliseErrors(CoreStash.VALIDATOR.errors)

      }
    )

    if (errors.length) throw CoreStash.error(CoreStash.INVALID, errors)
    else this.process(entities, 'validated')
  }


// ----- Processing -----


  /**
   * Processes entities at a particular stage during req processing.
   * @param {array} entities
   */
  process(entities, stage){

    var processEntity = (entity, schema, stage) => {
      if (schema.processors){

        for (let property in schema.properties){
          processEntity(entity[property], schema.properties[property], stage)
        }

        var processors = schema.processors[stage]
        if (processors && Object.keys(processors).length){
          for (let property in processors){

            var processor = CoreStash.PROCESSORS[processors[property]]

            if (processor){
              if (entity[property])
                entity[property] = processor(entity[property])
            } else {
              throw Object.assign(
                CoreStash.PROCESSOR_NOT_FOUND,
                {processorName: processors[property]}
              )
            }
          }
        }
      }

      return entity
    }

    for (let i in entities){
      entities[i] = processEntity(entities[i], this.service.schema, stage)
    }
  }
}


// ----- Utility ----


/**
 * Clones an entity.
 * @param {object}  Entity to clone.
 */
CoreStash.clone = (entity) => {
  return JSON.parse(JSON.stringify(entity))
}


/**
 * Returns a stash response object.
 * @param {object} status Response status
 * @param {array} entities Associated entities
 */
CoreStash.response = (status, entities = []) => {
  return Object.assign({}, status, {entities: entities})
}

/**
 * Returns a stash response object.
 * @param {object} status Response status
 * @param {array} errors Associated errors
 */
CoreStash.error = (status, errors = []) => {
  return Object.assign({}, status, {errors: errors})
}


// ----- Shared Validation -----


CoreStash.VALIDATOR = new Ajv({ allErrors: true, jsonPointers: true })
CoreStash.VALIDATOR.addSchema(require('../schemas/fields.json'))


// ----- Validation error messages -----


require('ajv-errors')(CoreStash.VALIDATOR);

/**
* Normalise error messages returned by the validator.
 * @param {array} errors
 */
CoreStash.normaliseErrors = (errors) => {
  return [{}].concat(errors).reduce(

    (cache, next) => {

      var
        field = next.dataPath.length
          ? next.dataPath.replace(/^\./, '')
          : next.params.missingProperty,
        error = {
          violation: next.keyword,
          message: next.message
        }

      cache[field] !== undefined
        ? cache[field].push(error)
        : cache[field] = [error]

      return cache
    }
  )
}


// ----- Shared Processors -----


CoreStash.HASHER = passwordHash

CoreStash.PROCESSORS = {}
CoreStash.PROCESSORS.HASH = (value) => {
  return CoreStash.HASHER.generate(
    value,
    {
      algorithm: 'sha512',
      saltLength: 16
    }
  )
}
CoreStash.PROCESSORS.BLANK = (value) => { return '*' }
CoreStash.PROCESSORS.LOWERCASE = (value) => { return value.toLowerCase() }


// ----- Statuses -----


CoreStash.SUCCESS = {status: 'Success', code: 200, expose: true}
CoreStash.CREATED = {status: 'Entities created', code: 201, expose: true}
CoreStash.INVALID = {error: 'Failed validation', code: 422, expose: true}
CoreStash.PROCESSOR_NOT_FOUND = {error: 'Schema field processor not found!', code: 500}
CoreStash.NOT_FOUND = {status: 'Entity not found', code: 404, expose: true}


module.exports = CoreStash