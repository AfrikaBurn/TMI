/**
 * @file CoreMemoryStash.js
 * Basic Memory Based CoreStash.
 */

"use strict"


const
  CoreStash = require('./CoreStash')


class CoreMemoryStash extends CoreStash {


  // ----- Process -----


  /**
   * Creates a new memory based data stash.
   * @inheritDoc
   */
  constructor(service){
    super(service)
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
    entities = CoreStash.clone(entities)

    this.process(entities, 'committed')

    return CoreStash.response(CoreStash.CREATED, entities)
  }

  /**
   * @inheritDoc
   */
  read(user, criteria, options = {}){

    var
      fields = options.fields || false,
      process = options.process != undefined ? options.process : true,
      matches = CoreStash.clone(
        this.cache.filter(
          (element) => {
            return CoreMemoryStash.matches(element, criteria)
          }
        )
      )

      if (fields) matches.forEach(
        (element, index) => {
          matches[index] = fields.reduce(
            (filtered, field) => {
              return element[field] != undefined || !fields
                ? Object.assign(filtered, {[field]: element[field]})
                : filtered;
            },
            {}
          )
        }
    )

    if (process) this.process(matches, 'retrieved')

    return CoreStash.response(CoreStash.SUCCESS, matches)
  }

  /**
   * @inheritDoc
   */
  update(user, criteria, entity){

    var
      toUpdate = this.cache.filter(
        (element) => {
          return CoreMemoryStash.matches(element, criteria)
        }
      ),
      updated = []

    if (toUpdate.length == 0) throw CoreStash.NOT_FOUND
    // TODO: partially validate "entity"
    this.validate([entity])
    toUpdate.forEach((element) => Object.assign(element, entity))
    var entities = CoreStash.clone(toUpdate)

    this.process(entities, 'committed')

    return CoreStash.response(CoreStash.SUCCESS, entities)
  }

  /**
   * @inheritDoc
   */
  delete(user, criteria){

    var
      toDelete = this.read(user, criteria, false).entities,
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

    this.process(deleted, 'deleted')

    return CoreStash.response(CoreStash.SUCCESS, deleted)
  }
}


// ----- Utility methods -----


/**
 * Does a match of an element to criteria.
 * @param  {object} element  [description]
 * @param  {object} criteria [description]
 * @return {boolean}         true if matching, false if not.
 */
CoreMemoryStash.matches = (element, criteria) => {
  for(let property in criteria){
    if (typeof criteria[property] == 'object'){
      if (!CoreMemoryStash.matches(element[property], criteria[property]))
        return false
    } else {
      if (element[property] != criteria[property]) return false
    }
  }
  return true
}


module.exports = CoreMemoryStash