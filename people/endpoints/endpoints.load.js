/**
 * @file endpoint.load.js
 * Session retrieval.
 */
"use strict"


const
  passport = require('passport'),
  expressSession = require('express-session'),
  Processor = core.processors.Processor


class SessionLoader extends Processor {


  /* ----- Construction ----- */


  /**
   * Sets up user deserialisation.
   */
  constructor(endpoint){
    super(endpoint)

    passport.deserializeUser(
      (userId, done) => { this.deserializeUser(userId, done) }
    )
  }


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      '': {
        'all': [
          this.expressSession(path),
          passport.initialize(),
          passport.session(),
          SessionLoader.USER_ROLE
        ],
      }
    }
  }


  /* ----- Identification ----- */


  /**
   * Deserializes a user referenced in the session
   * @param {integer} userId  User ID to deserialise.
   * @param {Function} done   Callback function upon competion.
   */
  deserializeUser(id, done){

    var users = bootstrap.endpoints['/user'].stash.read(
      {id: 0},
      {id: id},
      {processing: false}
    ).entities

    done(
      users && users.length == 0 ? SessionLoader.ACCOUNT_GONE : null,
      users[0]
    )
  }


  /* ----- Middleware ----- */


  /**
   * Express Session Middleware
   */
  expressSession(path) {

    var
      sessionStore = this.endpoint.stash.toSessionStore()

    return expressSession(
      {
        secret: bootstrap.config.endpoints[path].salt,
        resave: true,
        saveUninitialized: true,
        store: sessionStore,

        cookie: {
          path: '/',
          httpOnly: false,
          secure: false,
          maxAge: null,
          name: this.cookieName
        }
      }
    )
  }
}


/* ----- Static Middleware ----- */


/**
 * User system role assignment
 */
SessionLoader.USER_ROLE = function setRole(req, res, next){

  req.user = req.user
    ? req.user
    : {id: 0}

  req.user.is = {
    administrator: req.user.id === 1,
    anonymous: req.user.id === 0,
    authenticated: req.user.id >= 1
  }

  next()
}


/* ----- Static Response types ----- */


SessionLoader.ACCOUNT_GONE = { error: "Account removed", code: 410, expose: true }


module.exports  = SessionLoader