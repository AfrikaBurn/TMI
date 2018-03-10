/**
 * @file CacheStash.js
 * Basic Memory Stash.
 */

"use strict"


const

  Stash = require('../Stash')


class CacheStash extends Stash {

  /**
   * Creates a new memory based data stash
   * @param  {string} name   [description]
   * @param  {object} config [description]
   * @param  object minimi main boot strap
   */
  constructor(name, config, minimi){
    super(name, config, minimi)
    this.cache = []
  }


  // ----- CRUD methods -----


  /**
   * @inherit
   */
  create(entity){
    this.cache.push[entity]
    return [entity]
  }

  /**
   * @inherit
   */
  read(criteria){
    return this.cache.filter(
      (element) => {
        return this.matches(element, criteria)
      }
    )
  }

  /**
   * @inherit
   */
  update(criteria, entity){

    var
      toUpdate = this.read(criteria)

    for(let i in toUpdate){
      toUpdate[i] = Object.assign(toUpdate[i], entity)
    }

    return toUpdate
  }

  /**
   * @inherit
   */
  delete(criteria){
    return []
  }


  // ----- Utility methods -----


  /**
   * [matches description]
   * @param  {[type]} element  [description]
   * @param  {[type]} criteria [description]
   * @return {[type]}          [description]
   */
  matches(element, criteria){
    for(let property in criteria){
      if (element[property] != criteria[property]) return false
    }
    return true
  }
}


module.exports = CacheStash