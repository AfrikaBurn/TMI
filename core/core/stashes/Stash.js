/**
 * @file Stash.js
 * Basic Data Storage Stash.
 */

"use strict"


const
  Ajv = require('ajv')


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
    return [];
  }

  /**
   * Read entities matching the provided criteria.
   * @param  {object} criteria Partial entity to match.
   * @return {array}           Array of matching entities.
   */
  read(criteria){
    return [];
  }

  /**
   * Writes entities as they are.
   * @param {array} entities Array of entities to commit.
   * @return {array}         Array of updated entities
   */
  write(entities){
    return [];
  }

  /**
   * Update entities matching the provided criteria with the properties from
   * partial.
   * @param  {object} criteria  Partial entity to match.
   * @param  {object} partial   Partial entity to apply update from.
   * @return {array}            Array of updated entities
   */
  update(criteria, partial){
    return [];
  }

  /**
   * Delete all entities matching the provided criteria.
   * @param  {object} criteria Partial entity to match.
   * @return {array}           Array of deleted entities
   */
  delete(criteria){
    return [];
  }

  /**
   * Validate an array of entities against the stash schema.
   * @param {array} entities
   */
  validate(entities){

    var errors = []

    for (var i in entities){

      var valid = Stash.VALIDATOR.validate(
        this.minion.getConfig().schema,
        entities[i]
      )

      if (!valid) {
        var entityErrors = [{}].concat(Stash.VALIDATOR.errors).reduce(

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

        errors[i] = entityErrors
      }
    }

    if (errors.length) throw Object.assign(
      Stash.STATUS_INVALID,
      {errors: errors}
    )
  }
}


// ----- Shared Validator -----
Stash.VALIDATOR = new Ajv(
  { allErrors: true }
);
// ----- Shared Schemas -----
Stash.VALIDATOR.addSchema(require('../schemas/fields.json'))


// ----- Statuses -----
Stash.STATUS_CREATED = {status: 'Entities created', code: 201, expose: true}
Stash.STATUS_INVALID = {error: 'Failed validation', code: 422, expose: true}


module.exports = Stash