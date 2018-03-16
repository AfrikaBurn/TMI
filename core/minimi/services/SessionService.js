/**
 * @file SessionService.js
 * Basic session authentication and permission verification service.
 */

 "use strict"


const

  express = require('express'),
  session = require('express-session'),
  passport = require('passport'),

  Service = require('../Service'),
  LocalStrategy = require('passport-local').Strategy


class SessionService extends Service {

  /**
   * @inheritDoc
   */
  constructor(minion){
    super(minion)

    passport.serializeUser(
      (user, done) => { this.serializeUser(user, done) }
    )

    passport.deserializeUser(
      (userId, done) => { this.deserializeUser(userId, done) }
    )

    passport.use(
      new LocalStrategy(
        (username, password, done) => {
          this.authenticate(username, password, done)
        }
      )
    )
  }


  // ----- Method utilities -----


  /**
   * @inheritDoc
   */
  attach(){

    var path = this.minion.getConfig().path

    this.minion.minimi.router.post(path, Service.PARSE_BODY)
    this.minion.minimi.router.post(path, Service.PARSE_QUERY)

    this.minion.minimi.router.use(
      session(
        {
          secret: this.minion.getConfig().salt
        }
      )
    )

    this.minion.minimi.router.use(passport.initialize());
  }

  /**
   * @inheritDoc
   */
  detach(){

    var routes = this.minion.minimi.router.stack
    // TODO

  }


  // ----- Authentication -----


  /**
   * Authenticates a username and password combination.
   * @param {String} username Uniquely identifying username to check.
   * @param {String} password Password associated with the username to check.
   * @param {Function} done   Callback function upon competion.
   */
  authenticate(username, password, done){

    var
      user = this.minion.stash.read(
        {
          username: username,
          password: password
        }
      )

    if (user.length == 0)
      done(null, false, { message: 'Invalid credentials'})
    else
      done(null, user[0])
  }


  // ----- Utility -----


  /**
   * Serializes a user referenced in the session
   * @param {Obect} user      User to serialise.
   * @param {Function} done   Callback function upon competion.
   */
  serializeUser(user, done){
    done(null, user.userId);
  }

  /**
   * Deserializes a user referenced in the session
   * @param {integer} userId  User ID to deserialise.
   * @param {Function} done   Callback function upon competion.
   */
  deserializeUser(userId, done){
    var user = this.minion.stash.read({userId: userId})[0]
    done(
      user.length == 0 ? new Error('Not found'): null,
      user[0]
    )
  }
}


module.exports = SessionService