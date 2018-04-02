/**
 * @file TmiStash.js
 * TMI Base Stash.
 */

"use strict"


const

  Stash = require('../../core/stashes/Stash'),
  MemoryStash = require('../../core/stashes/MemoryStash')


class TmiStash extends MemoryStash {}


// ----- Shared Schemas -----
Stash.VALIDATOR.addSchema(require('../schemas/shared.schema.json'))


module.exports = TmiStash