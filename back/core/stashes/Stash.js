/**
 * @file Stash.js
 * Basic Data Stash.
 */

"use strict"


class Stash {

  /**
   * Creates a new storage object.
   * @param  {object} minion Parent minion object.
   */
  constructor(minion){
    this.minion = minion
  }

  /**
   * Closes the data stash.
   * @return {boolean}  True if close is successfull, false if not.
   */
  close(){
    return true;
  }


  // ----- CRUD -----


  /**
   * Create entities.
   * @param  {array}  entities Data entities to create.
   * @return {array}  Data entities that were created successfully.
   */
  create(entities){
    this.validate(entities)
    return entities;
  }

  /**
   * Read entities matching the provided partial.
   * @param  {object} partial Partial entity to match.
   * @return {array}  Array of matching entities.
   */
  read(partial){
    return partial;
  }

  /**
   * Update entities matching the provided partial entity.
   * @param  {object} partial   Partial entity to match.
   * @param  {object} entity    Entity to update (in the case of a
   *                            full entity update) or Partial entity (in the
   *                            case of a partial entity update).
   * @param  {boolean} full     boolean indicating whether this is a full entity
   *                            update. Defaults to true.
   * @return {array}            Array of updated entities
   */
  update(partial, entity, full = true){
    this.validate([entity], full)
    return entity;
  }

  /**
   * Delete all entities matching the provided partial entity.
   * @param  {object} partial Partial entity to match.
   * @return {array}  Array of deleted entities
   */
  delete(partial){
    return [partial];
  }


  // ----- Validation -----


  // /**
  //  * Validates the entity represented by the request body to the schema
  //  * @param  {array}    entities   array of entities to be validated
  //  * @param  {boolean}  partial    true if a partial validation is to be
  //  *                               performed, meaning only existing entity
  //  *                               attributes are to be validated. Defaults to
  //  *                               false meaning a full validation should be
  //  *                               performed.
  //  * @throws {object}   If validation fails on any of the entities.
  //  */
  // validate(entities, partial) {

  //   partial = false || partial

  //   var
  //     errors = {},
  //     error = false

  //   for (var i in entities) {
  //     errors[i] = partial
  //       ? validatePartialEntity(entity)
  //       : validateEntity(entity)
  //     error |= errors[i] !== true
  //   }

  //   if (error) {
  //     throw {
  //       "error": "validation failed",
  //       "code": 422,
  //       "errors": errors,
  //       "schema": validatorResponse.schema
  //     }
  //   }
  // }

  // /**
  //  * Validate a full entity
  //  * @param  {object} entity Entity to be validated
  //  * @return {mixed}         True if valid, errors if not
  //  */
  // validateEntity(entity){
  //   return this.propertyErrors(
  //     validator.validate(
  //       entity,
  //       this.minion.schema
  //     )
  //   )
  // }

  // /**
  //  * Validate a partial entity
  //  * @param  {object} entity Entity to be validated
  //  * @return {mixed}         True if valid, errors if not
  //  */
  // validatePartialEntity(entity) {

  //   var
  //     errors = [];

  //   for (var property in entity){

  //     var
  //       validatorResponse = validator.validate(
  //         entity[property],
  //         this.minion.schema.properties[property]
  //       )

  //     if (validatorResponse.errors.length) errors[property] += error.errors
  //   }

  //   return this.propertyErrors(
  //     {'errors': errors}
  //   )
  // }

  // /**
  //  * Format validator error response
  //  * @param  {object} validatorResponse validator response to be formatted
  //  * @return {mixed}  error object if errors, false if no errors
  //  */
  // propertyErrors(validatorResponse) {

  //   var
  //     errors = {},
  //     count = 0

  //   for (let errorIndex in validatorResponse.errors){

  //     var
  //       error = validatorResponse.errors[errorIndex]

  //     errors[error.argument] = {
  //       "name": error.name,
  //       "message": error.message
  //     }

  //     count++
  //   }

  //   return count ? processed : false
  // }
}


module.exports = Stash