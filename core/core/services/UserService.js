/**
 * @file UserService.js
 * Basic session authentication and permission verification service.
 */

 "use strict"


const

  express = require('express'),
  expressSession = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

  Service = require('./Service'),
  Stash = require('../stashes/Stash'),
  RestfulService = require('./RestfulService')


class UserService extends RestfulService {


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


  // ----- Request Loading -----


  /**
   * @inheritDoc
   */
  loaders(){
    return Object.assign(
      super.loaders(),
      {
        '': {
          'use': [
            this.expressSession(),
            this.passport(),
            this.passportSession(),
            UserService.USER_ROLE
          ],
        },
      }
    )
  }


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  routes(){
    return {

      [this.minion.path]: {
        'get': [Service.PARSE_QUERY],
        'post': [Service.PARSE_BODY],
        'put': [Service.PARSE_BODY],
        'delete': [Service.PARSE_QUERY],
        'patch': [Service.PARSE_QUERY, Service.PARSE_BODY]
      },

      [this.minion.path + '/login']: {
        'post': [
          Service.PARSE_BODY,
          Service.PARSE_QUERY,
          UserService.LOGIN
        ],
      },

      [this.minion.path + '/logout']: {
        'get': [
          (request, response, next) => {
              if (request.session)
                request.session.destroy(
                  () => {
                    request.logout()
                    response.clearCookie('connect.sid', {path: "/"})
                    response.json(Service.SUCCESS)
                  }
                )
          }
        ]
      }
    }
  }


  // ----- Method utilities -----


  /**
   * @inheritDoc
   */
  detach(){
    super.detach()

    var
      routes = this.minion.minimi.router.stack,
      keys = Object.keys(routes).reverse()

    keys.forEach(
      (key) => {
        if(routes[key].handle.serviceOrigin == 'UserService'){
          routes.splice(key, 1)
        }
      }
    )
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
      user = this.minion.stash.read({}, {username: username }, false, false)[1].pop()

    switch(true){
      case !user:
        return done(UserService.INVALID_ACCOUNT, false)
      case Stash.HASHER.verify(password, user.password):
        this.minion.stash.process([user], 'committed')
        return done(null, user)
      default:
      return done(UserService.INVALID_CREDENTIALS, false)
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

    var users = this.minion.stash.read({id: 0}, {id: id}, false)[1]

    done(
      users && users.length == 0 ? UserService.ACCOUNT_GONE : null,
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

    sessionHandler.serviceOrigin = 'UserService'
    return sessionHandler
  }

  /**
   * Passport Middleware
   */
  passport(){
    var init = passport.initialize()
    init.serviceOrigin = 'UserService'
    return init
  }

  /**
   * Passport Session Middleware
   */
  passportSession(){
    var passportSession = passport.session()
    passportSession.serviceOrigin = 'UserService'
    return passportSession
  }
}


// ----- Middleware -----


UserService.LOGIN = (request, response, next) => {
  passport.authenticate(
    'login',
    function(error, user, info) {
      if (error) throw error
      request.logIn(
        user,
        function(error) {
          if (error) throw error
          response.json(
            Object.assign(
              Stash.clone(Service.SUCCESS),
              { user: user }
            )
          )
        }
      )
    }
  )(request, response, next)
}

/**
 * User role
 */
UserService.USER_ROLE = function setRole(request, response, next){

  request.user = request.user
    ? Object.assign(request.user, {is: {}})
    : {id: 0, is: { anonymous: true }}

  Object.assign(
    request.user.is,
    {
      super: request.user.id === 1,
      authenticated: request.user.id > 1
    }
  )

  next()
}


// ----- Response types -----


UserService.INVALID_ACCOUNT = { error: "Invalid account", code: 401, expose: true }
UserService.INVALID_CREDENTIALS = { error: "Invalid credentials", code: 401, expose: true }
UserService.ACCOUNT_GONE = { error: "Account removed", code: 410, expose: true }


module.exports = UserService