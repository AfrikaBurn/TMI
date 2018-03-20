/**
 * @file SessionService.js
 * Basic session authentication and permission verification service.
 */

 "use strict"


const

  express = require('express'),
  session = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

  Service = require('./Service')


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
      'login',
      new LocalStrategy(
        (username, password, done) => {
          return this.authenticate(username, password, done)
        }
      )
    )
  }


  // ----- Method utilities -----


  /**
   * @inheritDoc
   */
  attach(){

    var path = '/' + this.minion.getConfig().path || 'session'

    this.minion.minimi.router.post(path, Service.PARSE_BODY)
    this.minion.minimi.router.post(path, Service.PARSE_QUERY)
    this.minion.minimi.router.use(this.session())
    this.minion.minimi.router.use(this.passport());
    this.minion.minimi.router.use(this.passportSession());

    this.minion.minimi.router.post(path,
      (request, response, next) => {
        passport.authenticate('login', function(error, user, info) {
          if (error) throw error
          request.logIn(user, function(error) {
            if (error) throw error
            return response.json(user);
          });
        })(request, response, next);
      }
    )
  }

  /**
   * @inheritDoc
   */
  detach(){
    super.detach()

    var
      routes = this.minion.minimi.router.stack,
      keys = Object.keys(routes).reverse()

    for(var i in keys){
      if(routes[keys[i]].handle.serviceOrigin == 'SessionService'){
        routes.splice(
          keys[i],
          1
        )
      }
    }
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
      userExists = this.getUserStash().read( {username: username }).length,
      user = this.getUserStash().read(
        {
          username: username,
          password: password
        }
      )

    switch(true){
      case !userExists:
        return done({ message: 'Invalid account', expose: true }, false)
      case userExists && user.length == 0:
        return done({ message: 'Invalid credentials', expose: true }, false)
      default:
        return done(null, user[0])
    }
  }

  /**
   * Serializes a user referenced in the session
   * @param {Obect} user      User to serialise.
   * @param {Function} done   Callback function upon competion.
   */
  serializeUser(user, done){
    done(null, user.id);
  }

  /**
   * Deserializes a user referenced in the session
   * @param {integer} userId  User ID to deserialise.
   * @param {Function} done   Callback function upon competion.
   */
  deserializeUser(id, done){
    var users = this.getUserStash().read({id: id})
    done(
      users.length == 0 ? { message: 'User not found', expose: true } : null,
      users[0]
    )
  }


  // ----- Utility -----


  /**
   * Gets the configured user minions' stash
   */
  getUserStash(){
    return this
      .minion
      .minimi
      .minions[this.minion.getConfig().userMinion].stash
  }


  // ----- Middleware -----


  /**
   * Session middleware
   */
  session(){
    var sessionHandler = session(
      {
        secret: this.minion.getConfig().salt,
        resave: true,
        saveUninitialized: true
      }
    )
    sessionHandler.serviceOrigin = 'SessionService'
    return sessionHandler
  }

  /**
   * Passport middleware
   */
  passport(){
    var init = passport.initialize()
    init.serviceOrigin = 'SessionService'
    return init
  }

  /**
   * Session Passport middleware
   */
  passportSession(){
    var passportSession = passport.session()
    passportSession.serviceOrigin = 'SessionService'
    return passportSession
  }

}


module.exports = SessionService