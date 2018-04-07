/**
 * @file Stash.js
 * TMI Base Stash.
 */

"use strict"


const
  CoreStash = require('../../core/stashes/CoreStash'),
  CoreMemoryStash = require('../../core/stashes/CoreMemoryStash')


class Stash extends CoreMemoryStash {

  /**
   * @inheritDoc
   */
  read(user, criteria, options = {}){
    var found = super.read(user, criteria, options)
    if (user.position) found.entities.forEach(
      (entity, index) => {
        Stash.redact(user.position.on[index], entity)
      }
    )

    return found
  }
}


// ----- Shared Schemas -----


CoreStash.VALIDATOR.addSchema(require('../schemas/shared/primitives.schema.json'))
CoreStash.VALIDATOR.addSchema(require('../schemas/shared/references.schema.json'))


// ----- Privacy redaction -----


Stash.redact = (positions, entity) => {
  if (typeof entity == 'object'){

    for(var property in entity){
      Stash.redact(positions, entity[property])
    }

    if (entity.privacy && !positions[entity.privacy]){
      entity.value = '*';
    }
  }
}


module.exports = Stash