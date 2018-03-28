/**
 * @file Stash.js
 * Basic Data Storage Stash.
 */

"use strict"


const
  Ajv = require('ajv'),
  passwordHash = require('password-hash')


class Stash {


  // ----- Process -----


  /**
   * Creates a new data stash.
   * @param  {object} nano Parent nano object.
   */
  constructor(nano){
    this.nano = nano
    Stash.VALIDATOR.addSchema(nano.schema, nano.getConfig().schema)
  }

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
      '\x1b[31m%s\x1b[0m', 'WARNING: ' + this.nano.name +
      ' nano is using a memory based stash for session storage!',
    );
    console.log(
      '\x1b[31m%s\x1b[0m', 'This is only intended for development and testing.'
    );
    console.log(
      '\x1b[31m%s\x1b[0m', 'Please use another stash for production use.'
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

    return [
      Stash.SUCCESS,
      this.process(entities, 'committed')
    ]
  }

  /**
   * Read entities matching the provided criteria.
   * @param  {object} user User reading the entities.
   * @param  {object} criteria Partial entity to match.
   * @param  {object} fields Fields to return, defaults to none.
   * @param  {boolean} process set to false to bypass retrieval processing,
   *                           defaults to false.
   * @return {array}           Array of matching entities.
   */
  read(user, criteria, fields = undefined, process = true){

    // Read entities here
    var entities = criteria

    return [
      Stash.SUCCESS,
      process
        ? criteria
        : this.process('retrieved')
    ]
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

    return [
      Stash.SUCCESS,
      process
        ? entities
        : this.process(entities, 'committed')
    ]
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

    return [
      Stash.SUCCESS,
      this.process(criteria, 'deleted')
    ]
  }


// ----- Validation -----


  /**
   * Validate an array of entities against the stash schema.
   * @param {array} entities
   */
  validate(entities){

    var errors = []

    this.process(entities, 'raw')

    entities.forEach(
      (entity, index) => {
        if (
          !Stash.VALIDATOR.validate(
            this.nano.getConfig().schema,
            entity
          )
        ) errors[index] = Stash.normaliseErrors(Stash.VALIDATOR.errors)

      }
    )

    if (errors.length) throw Object.assign(Stash.INVALID, {errors: errors})
    else this.process(entities, 'validated')
  }


// ----- Processing -----


  /**
   * Processes entities at a particular stage during request processing.
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

            var processor = Stash.PROCESSORS[processors[property]]

            if (processor){
              entity[property] = processor(entity[property])
            } else {
              throw Object.assign(
                Stash.PROCESSOR_NOT_FOUND,
                {processorName: processors[property]}
              )
            }
          }
        }
      }

      return entity
    }

    for (let i in entities){
      entities[i] = processEntity(entities[i], this.nano.schema, stage)
    }
  }
}


// ----- Utility ----


/**
 * Clones an entity.
 * @param {object}  Entity to clone.
 */
Stash.clone = (entity) => {
  return JSON.parse(JSON.stringify(entity))
}



// ----- Shared Validation -----


Stash.VALIDATOR = new Ajv({ allErrors: true, jsonPointers: true })
Stash.VALIDATOR.addSchema(require('../schemas/fields.json'))


// ----- Validation error messages -----


require('ajv-errors')(Stash.VALIDATOR);

/**
* Normalise error messages returned by the validator.
 * @param {array} errors
 */
Stash.normaliseErrors = (errors) => {
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


Stash.HASHER = passwordHash

Stash.PROCESSORS = {}
Stash.PROCESSORS.HASH = (value) => {
  return Stash.HASHER.generate(
    value,
    {
      algorithm: 'sha512',
      saltLength: 16
    }
  )
}
Stash.PROCESSORS.BLANK = (value) => { return '*' }
Stash.PROCESSORS.LOWERCASE = (value) => { return value.toLowerCase() }


// ----- Statuses -----


Stash.SUCCESS = {status: 'Success', code: 200, expose: true}
Stash.CREATED = {status: 'Entities created', code: 201, expose: true}
Stash.INVALID = {error: 'Failed validation', code: 422, expose: true}
Stash.PROCESSOR_NOT_FOUND = {error: 'Schema field processor not found!', code: 500}
Stash.NOT_FOUND = {status: 'Entity not found', code: 404, expose: true}


module.exports = Stash