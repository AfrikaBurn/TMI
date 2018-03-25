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

    for (let entity of entities){
      entity.id = this.cache.length
      this.cache.push(entity)
    }

    entities = JSON.parse(JSON.stringify(entities))
    this.sanitise(entities)

    return Object.assign(
      Stash.STATUS_CREATED,
      {entities: entities}
    )
  }

  /**
   * @inheritDoc
   */
  read(criteria){
    return JSON.parse(
      JSON.stringify(
        this.cache.filter(
          (element) => {
            return MemoryStash.matches(element, criteria)
          }
        )
      )
    )
  }

  /**
   * @inheritDoc
   */
  update(criteria, entity){

    var
      toUpdate = this.read(criteria),
      updated = []

    // TODO: partially validate "entity"

    for(let i in toUpdate){
      toUpdate[i] = Object.assign(toUpdate[i], entity)
    }

    this.cache = Object.assign(
      this.cache,
      toUpdate
    )

    entites = JSON.parse(JSON.stringify(entities))
    this.sanitise(toUpdate)

    return toUpdate
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
  for(var property in criteria){
    if (typeof criteria[property] == 'object'){
      if (!MemoryStash.matches(element[property], criteria[property]))
        return false
    } else {
      if (element[property] != criteria[property]) return false
    }
  }
  return true
}


module.exports = MemoryStash