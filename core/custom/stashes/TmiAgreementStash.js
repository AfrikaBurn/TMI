/**
 * @file TmiAgreementStash.js
 * TMI Agreement Stash.
 */

"use strict"


const

  Stash = require('../../core/stashes/Stash'),
  TmiStash = require('./TmiStash')


class TmiAgreementStash extends TmiStash {}

// ----- Shared Schemas -----
Stash.VALIDATOR.addSchema(require('../schemas/agreements/base.agreement.schema.json'))

module.exports = TmiAgreementStash