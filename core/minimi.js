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
  Minion = require('./minimi/Minion'),
  cors = require('cors')


class Minimi extends EventEmitter {

  /**
   * Bootstraps a new minion instance.
   */
  constructor(){

    super()

    this.init()
    this.load()
    this.start()
  }


  // ----- Main -----


  /**
   * Initialises minimi.
   */
  init(){

    this.config = require('./config.json')
    this.app = express()
    this.router = express.Router()
    this.minions = {}

    this.app.use(cors((request, callback) => this.bounce(request, callback) ))

    this.app.use(this.router)
    this.app.use(this.handleError)
    this.app.use(this.handleNotFound)

    process.chdir(path.normalize(__dirname))
    process.on('SIGINT', () => { process.exit() })
    process.on('SIGTERM', () => { process.exit() })
    process.on('exit', () => { this.stop() })

    console.log(
      '\nSpawning minimi: ' + this.config.name + ' seizing http://127.0.0.1:' +
      this.config.port +
      '\n'
    )
  }

  /**
   * Loads all minions defined in config.json
   */
  load(){
    for(let name in this.config.minions){
      this.delegate(name, this.config.minions[name])
    }
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


  // ----- Utility -----


  /**
   * Checks whether requests originate from allowed domains 
   * @param  {object}   request  Express request object
   * @param  {Function} callback Origin access callback
   */
  bounce(request, callback){
    callback(
      null,
      {
        origin: this.config.origins || [],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
      }
    )
  }


  /**
   * Delegate a minion as per the provided configuration
   * @param  {string} name   Minion name
   * @param  {object} config Minion configuration
   */
  delegate(name, config){

    if (this.minions[name]) this.minions[name].dispose()
    if (config) this.config.minions[name] = config

    this.minions[name] = new Minion(name, this)
  }


  // ----- Error handling -----


  /**
   * Handle errors
   * @param  {object}   error    Error that has occured
   * @param  {object}   request  Express request object
   * @param  {object}   response Express response object
   * @param  {Function} next     Next middleware
   */
  handleError(error, request, response, next){
    console.log(error)
    if (error.expose) response.status(error.code || 500).json({"error": error})
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

module.exports = new Minimi()