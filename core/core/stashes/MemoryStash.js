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
  create(entity){
    entity.id = this.cache.length
    this.cache.push(entity)
    return [entity]
  }

  /**
   * @inheritDoc
   */
  read(criteria){
    return this.cache.filter(
      (element) => {
        return this.matches(element, criteria)
      }
    )
  }

  /**
   * @inheritDoc
   */
  update(criteria, entity){

    var
      toUpdate = this.read(criteria)

    for(let i in toUpdate){
      toUpdate[i] = Object.assign(toUpdate[i], entity)
    }

    this.cache = Object.assign(
      this.cache,
      toUpdate
    )

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


  // ----- Utility methods -----


  /**
   * Does a shallow match of an element to criteria.
   * @param  {object} element  [description]
   * @param  {object} criteria [description]
   * @return {boolean}         true if matching, false if not.
   */
  matches(element, criteria){
    for(let property in criteria){
      if (element[property] != criteria[property]) return false
    }
    return true
  }
}


module.exports = MemoryStash