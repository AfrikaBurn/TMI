/**
 * @file UserExecutor.js
 * A basic processor template.
 */
"use strict"


const
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  Processor = core.processors.Processor


class UserExecutor extends core.processors.RestProcessor {


  /* ----- Construction ----- */


  /**
   * Sets up user deserialisation.
   * @inheritDoc
   */
  constructor(service){
    super(service)

    passport.serializeUser(
      (user, done) => { UserExecutor.serializeUser(user, done) }
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


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return Object.assign(
      super.routes(path),
      {
        [path + '/login']: {
          'post': [Processor.PARSE_BODY, UserExecutor.LOGIN]
        }
      },

      {
        [path + '/logout']: {
          'get': [UserExecutor.LOGOUT]
        }
      }
    )
  }


  /* ----- Authentication ----- */


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
        return done(UserExecutor.INVALID_ACCOUNT, false)
      case core.stashes.Stash.HASHER.verify(password, user.password):
        this.service.stash.process([user], 'committed')
        return done(null, user)
      default:
      return done(UserExecutor.INVALID_CREDENTIALS, false)
    }
  }
}


// ----- Static Middleware -----


/**
 * Passport login implementation.
 * @param  {object}   req  Express request object
 * @param  {object}   res  Express response object
 * @param  {Function} next Next middleware
 */
UserExecutor.LOGIN = (req, res, next) => {
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
              utility.clone(Processor.SUCCESS),
              { user: user }
            )
          )
        }
      )
    }
  )(req, res, next)
}

/**
 * Passport logout implementation.
 * @param  {object}   req  Express request object
 * @param  {object}   res  Express response object
 * @param  {Function} next Next middleware
 */
UserExecutor.LOGOUT = (req, res, next) => {
  if (req.session){
    req.session.destroy(
      () => {
        req.logout()
        res.clearCookie('connect.sid', {path: "/"})
        res.data = Processor.SUCCESS
        next()
      }
    )
  }
}

/**
 * Serializes a user into the session.
 * @param {Obect} user    User to serialise.
 * @param {Function} done Callback function upon competion.
 */
UserExecutor.serializeUser = (user, done) => {
  done(null, user.id)
}


/* ----- Static Response types ----- */


UserExecutor.INVALID_ACCOUNT = { error: "Invalid account", code: 401, expose: true }
UserExecutor.INVALID_CREDENTIALS = { error: "Invalid credentials", code: 401, expose: true }


module.exports = UserExecutor