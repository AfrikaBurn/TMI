/**
 * @file Stash.js
 * Basic Data Storage Stash.
 * TODO: Add validation
 */

"use strict"


class Stash {


  // ----- Process -----


  /**
   * Creates a new data stash.
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


  // TODO
}


module.exports = Stash