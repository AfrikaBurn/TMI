/**
 * @file MemoryStash.js
 * Basic Memory Based Stash.
 */

"use strict"


const
  Stash = require('./Stash')


class MemoryStash extends Stash {


  // ----- Process -----


  /**
   * Creates a new memory based data stash.
   * @inheritDoc
   */
  constructor(name, config, minimi){
    super(name, config, minimi)
    this.cache = []
  }


  // ----- Storage -----


  /**
   * @inheritDoc
   */
  create(entities){

    this.validate(entities)

    entities.forEach(
      (entity) => {
        entity.id = this.cache.length
        this.cache.push(entity)
      }
    )

    entities = MemoryStash.clone(entities)
    this.sanitise(entities)

    return Object.assign(
      Stash.CREATED,
      {entities: entities}
    )
  }

  /**
   * @inheritDoc
   */
  read(criteria, sanitise = true){

    var matches = this.cache.filter(
      (element) => {
        return MemoryStash.matches(element, criteria)
      }
    )

    var entities = MemoryStash.clone(matches)
    if (sanitise) this.sanitise(entities)

    return entities
  }

  /**
   * @inheritDoc
   */
  update(criteria, entity){

    var
      toUpdate = this.cache.filter(
        (element) => {
          return MemoryStash.matches(element, criteria)
        }
      ),
      updated = []

    if (toUpdate.length == 0) throw Stash.NOT_FOUND
    // TODO: partially validate "entity"
    this.validate([entity])
    toUpdate.forEach((element) => Object.assign(element, entity))

    var entities = MemoryStash.clone(toUpdate)
    this.sanitise(entities)

    return entities
  }

  /**
   * @inheritDoc
   */
  delete(criteria){

    var
      toDelete = this.read(criteria),
      deleted = []

    while(toDelete.length){
      var
        current = toDelete.pop(),
        index = this.cache.indexOf(current)
      if (index != -1) {
        this.cache.splice(index, 1)
        deleted.push(current)
      }
    }

    this.sanitise(deleted)

    return deleted
  }
}


// ----- Utility methods -----


/**
 * Does a match of an element to criteria.
 * @param  {object} element  [description]
 * @param  {object} criteria [description]
 * @return {boolean}         true if matching, false if not.
 */
MemoryStash.matches = (element, criteria) => {
  for(let property in criteria){
    if (typeof criteria[property] == 'object'){
      if (!MemoryStash.matches(element[property], criteria[property]))
        return false
    } else {
      if (element[property] != criteria[property]) return false
    }
  }
  return true
}

/**
 * Clones an entity.
 * @param {object}  Entity to clone.
 */
MemoryStash.clone = (entity) => {
  return JSON.parse(JSON.stringify(entity))
}


module.exports = MemoryStash