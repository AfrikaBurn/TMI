/**
 * @file endpoint.stash.js
 * Stash to be used for session storage.
 */
"use strict"


class SessionStash extends core.stashes.MemoryStash {}


module.exports  = SessionStash