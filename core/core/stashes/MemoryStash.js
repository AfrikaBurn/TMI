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
  constructor(name, config, bootstrap){
    super(name, config, bootstrap)
    this.cache = []
  }


  // ----- Storage -----


  /**
   * @inheritDoc
   */
  create(user, entities){

    this.validate(entities)

    entities.forEach(
      (entity) => {
        entity.id = this.cache.length
        this.cache.push(entity)
      }
    )
    entities = Stash.clone(entities)

    this.process(entities, 'committed')

    return [Stash.CREATED, entities]
  }

  /**
   * @inheritDoc
   */
  read(user, criteria, process = true, fields = false){

    var matches = Stash.clone(
      this.cache.filter(
        (element) => {
          return MemoryStash.matches(element, criteria)
        }
      )
    )

    if (fields) matches.forEach(
      (element, index) =>
        matches[index] = fields.reduce(
        (filtered, field) => {
          return element[field] != undefined
            ? Object.assign(filtered, {[field]: element[field]})
            : filtered;
        },
        {}
      )
    )

    if (process) this.process(matches, 'retrieved')
    return [
      Stash.SUCCESS,
      matches
    ]
  }

  /**
   * @inheritDoc
   */
  update(user, criteria, entity){

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
    var entities = Stash.clone(toUpdate)

    this.process(entities, 'committed')

    return [Stash.SUCCESS, entities]
  }

  /**
   * @inheritDoc
   */
  delete(user, criteria){

    var
      toDelete = this.read(user, criteria, false)[1],
      deleted = []

    while(toDelete.length){
      var
        current = toDelete.pop(),
        index = this.cache.map((e) => {return e.id} ).indexOf(current.id)
      if (index != -1) {
        this.cache.splice(index, 1)
        deleted.push(current)
      }
    }

    this.process(deleted, 'committed')

    return [Stash.SUCCESS, deleted]
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


module.exports = MemoryStash