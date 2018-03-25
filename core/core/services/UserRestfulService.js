/**
 * @file UserRestfulService.js
 * Basic session authentication and permission verification service.
 */

 "use strict"


const

  express = require('express'),
  expressSession = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

  Service = require('./Service'),
  RestfulService = require('./RestfulService')


class UserRestfulService extends RestfulService {


  // ----- Process -----


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


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  routes(){
    return {

      '': {
        'use': [
          this.expressSession(),
          this.passport(),
          this.passportSession(),
          this.setRole
        ],
      },

      [this.path]: {
        'get': [Service.PARSE_QUERY],
        'post': [Service.PARSE_BODY],
        'put': [Service.PARSE_BODY],
        'delete': [Service.PARSE_QUERY],
        'patch': [Service.PARSE_QUERY, Service.PARSE_BODY]
      },

      [this.path + '/login']: {
        'post': [
          Service.PARSE_BODY,
          Service.PARSE_QUERY,
          (request, response, next) => {
            passport.authenticate('login', function(error, user, info) {
              if (error) throw error
              request.logIn(user, function(error) {
                if (error) throw error
                response.json(user)
              });
            })(request, response, next)
          }
        ],
      },

      [this.path + '/logout']: {
        'get': [
          (request, response, next) => request.session.destroy(
            () => {
              request.logout()
              response.clearCookie('connect.sid', {path: "/"})
              response.json(Service.SUCCESS)
            }
          )
        ]
      }
    }
  }


  // ----- Method utilities -----


  /**
   * @inheritDoc
   */
  attach(){

    this.cookieName =
      (this.minion.minimi.name || 'minimi')
      .toLowerCase()
      .replace(/[^a-z0-9_\-]+/g, '')
      + '-session'

    super.attach()
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
      if(routes[keys[i]].handle.serviceOrigin == 'UserRestfulService'){
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
      userExists = this.minion.stash.read( {username: username }).length,
      user = this.minion.stash.read(
        {
          username: username,
          password: {value: password}
        }
      )

    switch(true){
      case !userExists:
        return done(UserRestfulService.INVALID_ACCOUNT, false)
      case userExists && user.length == 0:
        return done(UserRestfulService.INVALID_CREDENTIALS, false)
      default:
        return done(null, user[0])
    }
  }


  // ----- Utility -----


  /**
   * Serializes a user referenced in the session
   * @param {Obect} user      User to serialise.
   * @param {Function} done   Callback function upon competion.
   */
  serializeUser(user, done){
    done(null, user.id)
  }

  /**
   * Deserializes a user referenced in the session
   * @param {integer} userId  User ID to deserialise.
   * @param {Function} done   Callback function upon competion.
   */
  deserializeUser(id, done){

    var users = this.minion.stash.read({id: id})

    done(
      users.length == 0 ? UserRestfulService.ACCOUNT_GONE : null,
      users[0]
    )
  }


  // ----- Middleware -----


  /**
   * Session Middleware
   */
  expressSession(){

    var sessionHandler = expressSession(
      {
        secret: this.minion.getConfig().salt,
        resave: true,
        saveUninitialized: true,
        store: this.minion.stash.toSessionStore(),

        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: null,
          name: this.cookieName
        }
      }
    )

    sessionHandler.serviceOrigin = 'UserRestfulService'
    return sessionHandler
  }

  /**
   * Passport Middleware
   */
  passport(){
    var init = passport.initialize()
    init.serviceOrigin = 'UserRestfulService'
    return init
  }

  /**
   * Passport Session Middleware
   */
  passportSession(){
    var passportSession = passport.session()
    passportSession.serviceOrigin = 'UserRestfulService'
    return passportSession
  }

  /**
   * Sets the User role
   */
  setRole(request, response, next){
    if (!request.user) request.user = {id: 0, isAnonymous: true};
    request.user.isAdministrator = request.user.id === 1
    request.user.isAuthenticated = request.user.id > 1
    next()
  }
}


UserRestfulService.INVALID_ACCOUNT = { error: "Invalid account", code: 401, expose: true }
UserRestfulService.INVALID_CREDENTIALS = { error: "Invalid credentials", code: 401, expose: true }
UserRestfulService.ACCOUNT_GONE = { error: "Account removed", code: 410, expose: true }


module.exports = UserRestfulService