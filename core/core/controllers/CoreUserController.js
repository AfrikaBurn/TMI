/**
 * @file CoreUserController.js
 * Basic session authentication and permission verification controller.
 */

 "use strict"


const

  express = require('express'),
  expressSession = require('express-session'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,

  CoreController = require('./CoreController'),
  CoreStash = require('../stashes/CoreStash'),
  CoreRestfulController = require('./CoreRestfulController')


class CoreUserController extends CoreRestfulController {


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
            CoreUserController.USER_ROLE
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
        'get': [CoreController.PARSE_QUERY],
        'post': [CoreController.PARSE_BODY],
        'put': [CoreController.PARSE_BODY],
        'delete': [CoreController.PARSE_QUERY],
        'patch': [CoreController.PARSE_QUERY, CoreController.PARSE_BODY]
      },

      [this.service.path + '/login']: {
        'post': [
          CoreController.PARSE_BODY,
          CoreController.PARSE_QUERY,
          CoreUserController.LOGIN
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
                    res.json(CoreController.SUCCESS)
                  }
                )
          }
        ]
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
      user = this.service.stash.read(
        {},
        {username: username },
        {process: false}
      ).entities.shift()

    switch(true){
      case !user:
        return done(CoreUserController.INVALID_ACCOUNT, false)
      case CoreStash.HASHER.verify(password, user.password):
        this.service.stash.process([user], 'committed')
        return done(null, user)
      default:
      return done(CoreUserController.INVALID_CREDENTIALS, false)
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
    ).entities

    done(
      users && users.length == 0 ? CoreUserController.ACCOUNT_GONE : null,
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

    sessionHandler.controllerOrigin = 'CoreUserController'
    return sessionHandler
  }

  /**
   * Passport Middleware
   */
  passport(){
    var init = passport.initialize()
    init.controllerOrigin = 'CoreUserController'
    return init
  }

  /**
   * Passport Session Middleware
   */
  passportSession(){
    var passportSession = passport.session()
    passportSession.controllerOrigin = 'CoreUserController'
    return passportSession
  }
}


// ----- Middleware -----


CoreUserController.LOGIN = (req, res, next) => {
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
              CoreStash.clone(CoreController.SUCCESS),
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
CoreUserController.USER_ROLE = function setRole(req, res, next){

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


CoreUserController.INVALID_ACCOUNT = { error: "Invalid account", code: 401, expose: true }
CoreUserController.INVALID_CREDENTIALS = { error: "Invalid credentials", code: 401, expose: true }
CoreUserController.ACCOUNT_GONE = { error: "Account removed", code: 410, expose: true }


module.exports = CoreUserController