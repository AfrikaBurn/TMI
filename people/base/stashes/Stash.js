/**
 * @file Store.js
 * Basic Data Stash.
 */
"use strict"


const
  Ajv = require('ajv'),
  passwordHash = require('password-hash')


class Stash {


  /* ----- Construction ----- */


  /**
   * Creates a new data stash.
   * @param  {object} config endpoint configuration.
   */
  constructor(name, config, schema){
    this.name = name
    this.config = config
    this.schema = schema
  }


  // ----- Stash Setup -----


  /**
   * Performs installation tasks.
   */
  install(){}


  // ----- Stash Cleanup -----


  /**
   * Closes the data stash.
   * @return {boolean}  True if close is successfull, false if not.
   */
  close(){
    return true;
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

    this.process(entities, 'committed')

    return utility.response(Stash.CREATED, entities)
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

    return utility.response(Stash.SUCCESS, entities)
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

    return utility.response(Stash.SUCCESS, entities)
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

    return utility.response(Stash.SUCCESS, entities)
  }


  // ----- Validation -----


  /**
   * Validate an array of entities against the stash schema.
   * @param {array} entities
   */
  validate(entities){

    if (!Array.isArray(entities)) throw utility.error(
      Stash.INVALID,
      ["Array expected"]
    )

    var errors = []

    this.process(entities, 'raw')

    entities.forEach(
      (entity, index) => {
        if (
          !Stash.VALIDATOR.validate(
            this.name,
            entity
          )
        ) errors[index] = Stash.normaliseErrors(Stash.VALIDATOR.errors)

      }
    )

    if (errors.length) throw utility.error(Stash.INVALID, errors)
    else this.process(entities, 'validated')
  }


  // ----- Text Processing -----


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

            var processor = Stash.PROCESSORS[processors[property]]

            if (processor){
              if (entity[property])
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
      entities[i] = processEntity(entities[i], this.schema, stage)
    }
  }


  // ----- Compatibility -----


  /**
   * Returns a passport compatible session store version of this stash.
   * @return {object}
   */
  toSessionStore(){
    utility.log(
      '\x1b[33mWARNING: Using memory based stash for session storage!\n' +
      '\x1b[33mIt will fail with multiple connections!\n' +
      '\x1b[33mUse another stash for production.\x1b[0m',
      {indent: 4, verbose: false, once: true}
    );
    return undefined;
  }
}


// ----- Statuses -----


Stash.SUCCESS = {status: 'Success', code: 200, expose: true}
Stash.CREATED = {status: 'Entities created', code: 201, expose: true}
Stash.INVALID = {error: 'Failed validation', code: 422, expose: true}
Stash.PROCESSOR_NOT_FOUND = {error: 'Schema field processor not found!', code: 500}
Stash.NOT_FOUND = {status: 'Entity not found', code: 404, expose: true}


// ----- Shared Validation -----


Stash.VALIDATOR = new Ajv({ allErrors: true, jsonPointers: true })


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


// ----- Static text processors -----


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


module.exports = Stash