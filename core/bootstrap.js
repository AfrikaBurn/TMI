/**
 * @file core.js
 * Core bootstrapping code.
 */
"use strict"


const
  express = require('express'),
  fs = require('fs'),
  pathUtil = require('path'),
  parseError = require('express-body-parser-json-error')(),
  cors = require('cors')


class Bootstrap {


  /* ----- Construction ----- */


  /**
   * Bootstraps the service.
   */
  constructor(){

    this.setupApp()

    console.log(
      '\n\Spinning up \x1b[1mMINI\x1b[0mmal \x1b[1mMI\x1b[0mcroservice:\n' +
      '\x1b[34m' + this.config.name + '\n'
    )

    utility.log('\x1b[1mLOADING\x1b[0m\n')
    this.setupWhitelist()
    this.setupRouters()
    this.setupServices()

    if (this.root) {
      utility.log('\x1b[1mINSTALLING\x1b[0m\n')
      this.root.install()
      this.start()
    }
  }


  // ----- Server Setup -----


  /**
   * Setup connection whitelist.
   */
  setupWhitelist(){
    this.app.use(
      cors(
        (request, callback) => callback(
          null,
          {
            origin: this.config.whitelist || [],
            allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
          }
        )
      )
    )
  }

  /**
   * Setup local variables, config, routers and processors.
   */
  setupApp(){

    global.bootstrap = this;

    this.app = express()
    this.config = require('./config.json')
    this.installRoot = pathUtil.normalize(__dirname)
    this.serviceRoot = this.installRoot + '/service'

    this.routers = {}
    this.services = {}
    this.root = false

    process.chdir(this.installRoot)
    process.on('SIGINT',  () => { process.exit() })
    process.on('SIGTERM', () => { process.exit() })
    process.on('exit',    () => { this.stop()    })
  }

  /**
   * Setup global routers.
   */
  setupRouters(){

    var
      phases = this.config.phases || ['load', 'access', 'execute']

    for (let phase of phases){
      this.routers[phase] = express.Router()
      this.app.use(this.routers[phase])
    }

    this.app.use(this.handleException)
    this.app.use(this.handleResponse)
    this.app.use(this.handleNotFound)
  }

  /**
   * Delegate to services.
   */
  setupServices(){

    this.root = false

    try{
      var Service = require(bootstrap.serviceRoot + 'service.js')
      this.root = new Service('root', this, '/', bootstrap.serviceRoot)
    } catch (e) {
      if (e.code == 'MODULE_NOT_FOUND'){
        this.root = new core.services.Service(
          'root', this, '/', bootstrap.serviceRoot
        )
      } else {
        console.log(e)
      }
    }
  }


  // ----- Server control -----


  /**
   * Start the server.
   */
  start(){
    this.app.listen(
      this.config.port,
      () => {
        console.log(
          '\n\nOccupying \x1b[1mhttp://127.0.0.1:' + this.config.port + '\n\n' +
          '\x1b[0m' +
          '\x1b[34m' + this.config.name + ' is ready.\x1b[0m\n\n'
        )
      }
    )
  }

  /**
   * Stop the server.
   */
  stop(){
    console.log('\x1b[31m kill command received!\n');

    for (var name in this.services){
      process.stdout.write('Retiring ' + name + ' service... ');
      this.services[name].stop()
      console.log('done.');
    }

    console.log(
      '\n\x1b[34m' + this.config.name + ' is done.\x1b[0m\n'
    )
  }


  /* ----- Response handling ----- */


  /**
   * Commit the data contained within the response object.
   * @param  {object}   req  Express request object
   * @param  {object}   res  Express response object
   * @param  {Function} next Next middleware
   */
  handleResponse(req, res, next){
    if (res.data){
      res.status(res.data.code).json(res.data)
    } else next()
  }

  /**
   * Handle exceptions. Exceptions may be errors or immediate responses.
   * @param  {object}   exception Exception that has occured
   * @param  {object}   req       Express request object
   * @param  {object}   res       Express response object
   * @param  {Function} next      Next middleware
   */
  handleException(exception, req, res, next){

    if (exception instanceof Error){
      console.log('\x1b[33m' + req.method + ' ' + req.url)
      exception.stack
        ? console.log('\x1b[33m%s\x1b[0m', exception.stack)
        : console.log(exception)
        console.log('\x1b[0m')
    }

    if (exception.expose)
      res.status(exception.code || 500).json(exception)
    else
      res.status(500).end('Internal Server Error')
  }

  /**
   * Handle not found.
   * @param  {object} req  Express request object
   * @param  {object} res  Express response object
   */
  handleNotFound(req, res){
    res.status(404).json({"error": 'Not found!'})
  }
}


/* ----- Global Core Classes ----- */


global.core = {

  processors: {
    AccessProcessor:    require('./base/processors/AccessProcessor'),
    Processor:          require('./base/processors/Processor'),
    UniformProcessor:  require('./base/processors/UniformProcessor'),
    RestProcessor:      require('./base/processors/RestProcessor'),
    ServiceProcessor:   require('./base/processors/ServiceProcessor')
  },

  stashes: {
    Stash: require('./base/stashes/Stash'),
    MemoryStash: require('./base/stashes/MemoryStash')
  },

  services: {
    Service: require('./base/services/Service'),
    MetaService: require('./base/services/MetaService')
  },

  installers: {
    Installer: require('./base/installers/Installer.js')
  }
}


/* ----- Global Utility ----- */


global.utility = {

  /**
   * Clones an entity.
   * @param {object}  Entity to clone.
   */
  clone: (entity) => {
    return JSON.parse(JSON.stringify(entity))
  },

  /**
   * Returns a structured status object.
   * @param {object} status Response status
   * @param {array} entities Associated entities
   */
  response: (status, entities = []) => {
    return Object.assign({}, status, {entities: entities})
  },

  /**
   * Returns a structured error response object.
   * @param {object} status Response status
   * @param {array} errors Associated errors
   */
  error: (status, errors = []) => {
    return Object.assign({}, status, {errors: errors})
  },

  /**
   * Logs a message at a specified indent,
   * @param {string} message  Message to log
   * @param {int} indent      Indent to apply
   */
  log: (message, indent = 0) => {

    var padding = ' '.repeat(indent)

    typeof message == 'string'
      ? console.log(padding + message.replace(/\n/g, '\n' + padding))
      : console.log(message.message, message.stack)
  }
}


module.exports = new Bootstrap()