/**
 * @file bootstrap.js
 * Contains nano bootstrapping code.
 */

"use strict"


const

  express = require('express'),
  fs = require('fs'),
  path = require('path'),
  parseError = require('express-body-parser-json-error')(),
  EventEmitter = require('events'),
  Service = require('./core/Service'),
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
    this.services = {}
    this.path = path.normalize(__dirname)
    this.routers = {
      load: express.Router(),
      modify: express.Router(),
      route: express.Router()
    }

    console.log(
      '\nSpawning \x1b[1mMINI\x1b[0mmal \x1b[1mMI\x1b[0mcroservice:\n\n' +
      '\x1b[34m' + this.config.name + '\n'
    )

    process.chdir(this.path)
    process.on('SIGINT', () => { process.exit() })
    process.on('SIGTERM', () => { process.exit() })
    process.on('exit', () => { this.stop() })

    this.app.use(cors((request, callback) => callback(null,
      {
        origin: this.config.origins || [],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
      }
    )))
    this.app.use(this.routers.load)
    this.app.use(this.routers.modify)
    this.app.use(this.routers.route)
    this.app.use(this.handleError)
    this.app.use(this.handleNotFound)

    this.delegate()
    this.install()
    this.start()
  }

  /**
   * Delegate to a services as per the provided configuration
   */
  delegate(){
    for(var name in this.config.services){
      this.services[name] = new Service(name, this)
    }
  }

  /**
   * Delegate to a services as per the provided configuration
   */
  install(){
    for(var name in this.services){
      console.log('\n  Installing: \x1b[1m' + name)
      this.services[name].install()
      console.log('\x1b[32m  Done.')
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
        console.log(
          '\n\nOccupying \x1b[1mhttp://127.0.0.1:' + this.config.port + '\n' +
          '\x1b[34m' + this.config.name + ' is ready.\n'
        )
      }
    )
  }

  /**
   * Stop the service.
   */
  stop(){

    console.log(' kill command received!\n');

    for (var name in this.minions){
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
    if (error.expose)
      response.status(error.code || 500).json(error)
    else
      response.status(500).end('Internal Server Error')
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