/**
 * @file SessionStash.js
 * User Stash.
 */
"use strict"


const
  Stash = core.stashes.MemoryStash


class SessionStash extends Stash {}


module.exports = SessionStash