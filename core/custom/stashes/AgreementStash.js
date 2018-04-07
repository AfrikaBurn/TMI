/**
 * @file AgreementStash.js
 * TMI Agreement Stash.
 */

"use strict"


const

  CoreStash = require('../../core/stashes/CoreStash'),
  Stash = require('./Stash')


class AgreementStash extends Stash {}


// ----- Shared Schemas -----


CoreStash.VALIDATOR.addSchema(require('../schemas/agreements/base.agreement.schema.json'))


module.exports = AgreementStash