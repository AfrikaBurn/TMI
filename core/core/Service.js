/**
 * @file Service.js
 * Basic configurable Service that contains a controller and a stash.
 */

"use strict"


const
fs = require('fs'),
path = require('path')


class Service {


  // ----- Process -----


  /**
   * Constructs a new service
   * @param  {string} name      Service name
   * @param  {object} bootstrap main boot strap
   */
  constructor(path, bootstrap){

    this.bootstrap = bootstrap
    this.path = path

    var
      config = this.getConfig(),
      controller = config.controller
        ? config.controller
        : 'Controller',
      stash = config.stash
        ? config.stash
        : false

    console.log(
      '\n  Spawning nanoservice at \x1b[1m/' + path + ':'
    );

    this.schema = config.schema ? this.find('schemas', config.schema) : false;
    this.stash = stash ? this.find('stashes', stash) : false
    this.controller = this.find('controllers', controller)
    console.log(
        (config.schema ? '\x1b[37m    Schema:     ' + config.schema + '\n' : '' ) +
      '\x1b[37m    Stash:      ' + stash + '\n' +
      '\x1b[37m    Controller: ' + controller + '\n' +
      '\x1b[32m  Done.'
    )
  }

  /**
   * Install the service.
   */
  install(){
    this.stash.install()
    this.controller.install()
  }

  /**
   * Dispose of the service.
   */
  dispose(){
    this.stash.close()
  }


  // ----- Accessors -----


  /**
   * Returns the config for this service
   */
  getConfig(){
    return this.bootstrap.config.services[this.path]
  }


  // ----- Utility -----


  /**
   * Locates and instantiates a Controller or Stash
   * @param  {string} type   controllers|stashes
   * @param  {string} name   object classname
   */
  find(type, name){

    var
      found = false,
      locations = ['../custom/' + type + '/', './' + type + '/']

    locations.forEach(
      (location) => {

        var
          localPath = location + name + (type == 'schemas' ? '.json' : '.js'),
          fullPath = path.resolve(__dirname + '/' + localPath),
          exists = fs.existsSync(fullPath)

        if (fs.existsSync(fullPath))
          found = type == 'schemas'
            ? require(localPath)
            : new (require(localPath))(this)
      }
    )

    if (found) return found
    else throw new Error(name + ' not found in ' + type)
  }
}


module.exports = Service