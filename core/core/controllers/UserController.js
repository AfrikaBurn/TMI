/**
 * @file UserController.js
 * Basic session authentication and permission verification controller.
 */

 "use strict"


const

  express = require('express'),
  expressSession = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

  Controller = require('./Controller'),
  Stash = require('../stashes/Stash'),
  RestfulController = require('./RestfulController')


class UserController extends RestfulController {


  // ----- Process -----


  /**
   * @inheritDoc
   */
  constructor(service){
    super(service)

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
      {
        '': {
          'use': [
            this.expressSession(),
            this.passport(),
            this.passportSession(),
            UserController.USER_ROLE
          ],
        },
      },
      super.loaders()
    )
  }


  // ----- Request Routing -----


  /**
   * @inheritDoc
   */
  routes(){
    return {

      [this.service.path]: {
        'get': [Controller.PARSE_QUERY],
        'post': [Controller.PARSE_BODY],
        'put': [Controller.PARSE_BODY],
        'delete': [Controller.PARSE_QUERY],
        'patch': [Controller.PARSE_QUERY, Controller.PARSE_BODY]
      },

      [this.service.path + '/login']: {
        'post': [
          Controller.PARSE_BODY,
          Controller.PARSE_QUERY,
          UserController.LOGIN
        ],
      },

      [this.service.path + '/logout']: {
        'get': [
          (req, res, next) => {
              if (req.session)
                req.session.destroy(
                  () => {
                    req.logout()
                    res.clearCookie('connect.sid', {path: "/"})
                    res.json(Controller.SUCCESS)
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
      routes = this.service.bootstrap.router.stack,
      keys = Object.keys(routes).reverse()

    keys.forEach(
      (key) => {
        if(routes[key].handle.controllerOrigin == 'UserController'){
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
      user = this.service.stash.read(
        {},
        {username: username },
        {process: false}
      )[1].shift()

    switch(true){
      case !user:
        return done(UserController.INVALID_ACCOUNT, false)
      case Stash.HASHER.verify(password, user.password):
        this.service.stash.process([user], 'committed')
        return done(null, user)
      default:
      return done(UserController.INVALID_CREDENTIALS, false)
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

    var users = this.service.stash.read(
      {id: 0},
      {id: id},
      {processing: false}
    )[1]

    done(
      users && users.length == 0 ? UserController.ACCOUNT_GONE : null,
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
        secret: this.service.config.salt,
        resave: true,
        saveUninitialized: true,
        store: this.service.stash.toSessionStore(),

        cookie: {
          path: '/',
          httpOnly: true,
          secure: false,
          maxAge: null,
          name: this.cookieName
        }
      }
    )

    sessionHandler.controllerOrigin = 'UserController'
    return sessionHandler
  }

  /**
   * Passport Middleware
   */
  passport(){
    var init = passport.initialize()
    init.controllerOrigin = 'UserController'
    return init
  }

  /**
   * Passport Session Middleware
   */
  passportSession(){
    var passportSession = passport.session()
    passportSession.controllerOrigin = 'UserController'
    return passportSession
  }
}


// ----- Middleware -----


UserController.LOGIN = (req, res, next) => {
  passport.authenticate(
    'login',
    function(error, user, info) {
      if (error) throw error
      req.logIn(
        user,
        function(error) {
          if (error) throw error
          res.json(
            Object.assign(
              Stash.clone(Controller.SUCCESS),
              { user: user }
            )
          )
        }
      )
    }
  )(req, res, next)
}

/**
 * User system role assignment
 */
UserController.USER_ROLE = function setRole(req, res, next){

  req.user = req.user
    ? Object.assign(req.user, {is: {}})
    : {id: 0, is: { anonymous: true }}

  Object.assign(
    req.user.is,
    {
      administrator: req.user.id === 1,
      authenticated: req.user.id >= 1
    }
  )

  next()
}


// ----- Response types -----


UserController.INVALID_ACCOUNT = { error: "Invalid account", code: 401, expose: true }
UserController.INVALID_CREDENTIALS = { error: "Invalid credentials", code: 401, expose: true }
UserController.ACCOUNT_GONE = { error: "Account removed", code: 410, expose: true }


module.exports = UserController