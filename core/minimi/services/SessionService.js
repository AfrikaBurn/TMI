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
      'login',
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

    this.path = this.minion.getConfig().path || 'session'
    this.minion.minimi.router.post('/' + this.path, Service.PARSE_BODY)
    this.minion.minimi.router.post('/' + this.path, Service.PARSE_QUERY)

    var sessionHandler = session(
      {
        secret: this.minion.getConfig().salt,
        resave: true,
        saveUninitialized: true
      }
    )
    sessionHandler.serviceOrigin = 'SessionService'
    this.minion.minimi.router.use(sessionHandler)

    var init = passport.initialize()
    init.serviceOrigin = 'SessionService'
    this.minion.minimi.router.use(init);

    var passportSession = passport.initialize()
    passportSession.serviceOrigin = 'SessionService'
    this.minion.minimi.router.use(passportSession);

    this.minion.minimi.router.post('/' + this.path,
      (request, response, next) => {
        passport.authenticate('login', function(err, user, info) {
          if (err || !user) { throw new Error('Invalid credentials') }
          request.logIn(user, function(err) {
            if (err) { throw new Error('Login error') }
            return response.json({yay: "YAY"});
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
      path = '/' + this.path,
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
      users = this.minion.minimi.minions[this.minion.getConfig().users].stash,
      user = users.read(
        {
          username: username,
          pass: password
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
    done(null, user.username);
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