/**
 * @file TmiStash.js
 * TMI Base Stash.
 */

"use strict"


const

  Stash = require('../../core/stashes/Stash'),
  MemoryStash = require('../../core/stashes/MemoryStash')


class TmiStash extends MemoryStash {

  /**
   * @inheritDoc
   */
  read(user, criteria, options = {}){
    var found = super.read(user, criteria, options)
    if (user.position) found.entities.forEach(
      (entity, index) => {
        TmiStash.redact(user.position.on[index], entity)
      }
    )

    return found
  }
}


// ----- Shared Schemas -----
Stash.VALIDATOR.addSchema(require('../schemas/shared.schema.json'))


TmiStash.redact = (positions, entity) => {
  if (typeof entity == 'object'){

    for(var property in entity){
      TmiStash.redact(positions, entity[property])
    }

    if (entity.privacy && !positions[entity.privacy]){
      entity.value = '*';
    }
  }
}


module.exports = TmiStash