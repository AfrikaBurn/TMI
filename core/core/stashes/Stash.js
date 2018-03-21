/**
 * @file Stash.js
 * Basic Data Storage Stash.
 * TODO: Add validation
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
    this.partialValidator = new Ajv({allErrors: true})
    this.fullValidator = this.partialValidator.compile(this.minion.schema)
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
    return entities;
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
    return [criteria];
  }


  // ----- Validation -----


  validate(entity){
    if (!this.fullValidator.validate(entity)){
      console.log(this.fullValidator.errors)
    }
  }
}


module.exports = Stash