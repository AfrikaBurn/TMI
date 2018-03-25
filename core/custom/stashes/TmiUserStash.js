/**
 * @file UserStash.js
 * Basic memory based User Stash.
 */

"use strict"


const

  Stash = require('../../core/stashes/Stash'),
  MemoryStash = require('../../core/stashes/MemoryStash')


class TmiUserStash extends MemoryStash {}


// ----- Shared Schemas -----
Stash.VALIDATOR.addSchema(require('../schemas/fields.json'))


module.exports = TmiUserStash