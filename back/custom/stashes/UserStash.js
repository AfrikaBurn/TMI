/**
 * @file UserStash.js
 * Basic memory based User Stash.
 */

"use strict"


const

CashStash = require('../../minimi/stashes/CacheStash')


class UserStash extends CashStash {


  // ----- Method responders


  get(request, response){

  }
}


module.exports = UserStash