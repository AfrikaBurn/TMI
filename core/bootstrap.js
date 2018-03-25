/**
 * @file minimi.js
 * Contains minion bootstrapping code.
 */

"use strict"


const

  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  parseError = require('express-body-parser-json-error')(),
  EventEmitter = require('events'),
  Minion = require('./core/Minion'),
  cors = require('cors')


class Bootstrap extends EventEmitter {


  // ----- Process -----


  /**
   * Constructs Bootstrap.
   */
  constructor(){

    super()

    this.app = express()
    this.config = require('./config.json')
    this.minions = {}
    this.path = path.normalize(__dirname)
    this.router = express.Router()

    console.log(
      '\nSpawning minimimal microservice:\n' +
      this.config.name +
      ' occupying http://127.0.0.1:' +
      this.config.port +
      '\n'
    )

    this.initialise()
    this.start()
  }

  /**
   * Initialise minimi.
   */
  initialise(){

    process.chdir(this.path)
    process.on('SIGINT', () => { process.exit() })
    process.on('SIGTERM', () => { process.exit() })
    process.on('exit', () => { this.stop() })

    this.app.use(cors(
      (request, callback) => callback(
        null,
        {
          origin: this.config.origins || [],
          allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
        }
      )
    ))

    this.app.use(this.router)
    this.app.use(this.handleError)
    this.app.use(this.handleNotFound)

    for(let name in this.config.minions){
      this.delegate(name, this.config.minions[name])
    }
  }

  /**
   * Delegate to a minion as per the provided configuration
   * @param  {string} name   Minion name
   * @param  {object} config Minion configuration
   */
  delegate(name, config){

    if (this.minions[name]) this.minions[name].dispose()
    if (config) this.config.minions[name] = config

    this.minions[name] = new Minion(name, this)
  }


  // ----- Service control -----


  /**
   * Start the service.
   */
  start(){
    this.app.listen(
      this.config.port,
      () => {
        console.log(this.config.name + ' is ready.\n')
      }
    )
  }

  /**
   * Stop the service.
   */
  stop(){

    console.log(' kill command received!\n');

    for (let name in this.minions){
      process.stdout.write('Retiring ' + name + ' minion... ');
      this.minions[name].dispose()
      console.log('done.');
    }

    console.log(
      '\n' + this.config.name + ' is done.\n'
    )
  }


  // ----- Error handling -----


  /**
   * Handle errors.
   * @param  {object}   error    Error that has occured
   * @param  {object}   request  Express request object
   * @param  {object}   response Express response object
   * @param  {Function} next     Next middleware
   */
  handleError(error, request, response, next){
    error.stack
      ? console.log(error.stack)
      : console.log(error)
    if (error.expose) response.status(error.code || 500).json(error)
  }

  /**
   * Handle not found
   * @param  {object}   request  Express request object
   * @param  {object}   response Express response object
   */
  handleNotFound(request, response){
    response.status(404).json({"error": 'Not found!'})
  }
}


module.exports = new Bootstrap()