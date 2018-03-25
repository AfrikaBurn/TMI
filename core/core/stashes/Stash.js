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
   * @param  {object} minion Parent minion object.
   */
  constructor(minion){
    this.minion = minion
    Stash.VALIDATOR.addSchema(minion.schema, minion.getConfig().schema)
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
      '\x1b[31m%s\x1b[0m', 'WARNING: ' + this.minion.name +
      ' minion is using a memory based stash for session storage!',
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
   * @param  {array} entities Array of data entities to create.
   * @return {array} Data     Array of entities that were created successfully.
   */
  create(entities){

    this.validate(entities)
    // Make changes
    this.sanitise(entities)

    return [entities]
  }

  /**
   * Read entities matching the provided criteria.
   * @param  {object} criteria Partial entity to match.
   * @return {array}           Array of matching entities.
   */
  read(criteria){
    return [criteria];
  }

  /**
   * Update entities matching the provided criteria with the properties from
   * partial.
   * @param  {object} criteria  Partial entity to match.
   * @param  {object} partial   Partial entity to apply update from.
   * @return {array}            Array of updated entities
   */
  update(criteria, partial){

    //TODO partially validate
    this.validate(entities)
    // Make changes
    this.sanitise(entities)

    return [entities];
  }

  /**
   * Delete all entities matching the provided criteria.
   * @param  {object} criteria Partial entity to match.
   * @return {array}           Array of deleted entities
   */
  delete(criteria){
    return [criteria]
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
            this.minion.getConfig().schema,
            entity
          )
        ) errors[index] = Stash.normaliseErrors(Stash.VALIDATOR.errors)
      }
    )

    if (errors.length) throw Object.assign(Stash.INVALID, {errors: errors})
    else this.process(entities, 'validated')
  }


// ----- Sanitisation -----


  /**
   * Sanitise created entities after being committed.
   * @param {array} entities
   */
  sanitise(entities){
    this.process(entities, 'committed')
  }


// ----- Processing -----


  /**
   * Processes entities at a particular stage during request processing.
   * @param {array} entities
   */
  process(entities, stage = true){

    var processEntity = (entity, schema, stage) => {
      if (schema.processors){

        var processors = schema.processors[stage]

        for (let property in schema.properties){
          processEntity(entity[property], schema.properties[property], stage)
        }

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
      entities[i] = processEntity(entities[i], this.minion.schema, stage)
    }
  }
}


// ----- Shared Validation -----


Stash.VALIDATOR = new Ajv({ allErrors: true });
Stash.VALIDATOR.addSchema(require('../schemas/fields.json'))
Stash.HASHER = passwordHash
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


Stash.PROCESSORS = {}
Stash.PROCESSORS.PASSWORD_HASH = (value) => {
  return passwordHash.generate(
    value,
    {
      algorithm: 'sha512',
      saltLength: 16
    }
  )
}
Stash.PROCESSORS.PASSWORD_BLANK = (value) => { return '*' }
Stash.PROCESSORS.LOWERCASE = (value) => { return value.toLowerCase() }


// ----- Statuses -----


Stash.SUCCESS = {status: 'Success', code: 200, expose: true}
Stash.CREATED = {status: 'Entities created', code: 201, expose: true}
Stash.INVALID = {error: 'Failed validation', code: 422, expose: true}
Stash.PROCESSOR_NOT_FOUND = {error: 'Schema field processor not found!', code: 500}
Stash.NOT_FOUND = {status: 'Entity not found', code: 404, expose: true}


module.exports = Stash