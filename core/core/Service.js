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
   * @param  {object} config    Service configuration
   * @param  {object} bootstrap main boot strap
   */
  constructor(path, config, bootstrap, tabSize = 0){

    this.bootstrap = bootstrap
    this.path = path
    this.config = config

    var
      controller = config.controller
        ? config.controller
        : 'Controller',
      stash = config.stash
        ? config.stash
        : false,
      tab = ''.padStart(tabSize)

    console.log(
      tab + '\x1b[0m  Loading service at \x1b[1m/' + path + ':\x1b[0m'
    );

    switch (typeof config.schema){
      case 'string': this.schema = this.find('schemas', config.schema); break
      case 'object':
        this.schema = this.config.schema
        this.config.schema = this.config.schema.name
      break
      default: this.schema = false
    }
    this.stash = stash ? this.find('stashes', stash) : false
    this.controller = this.find('controllers', controller)

    console.log(
      tab + (config.schema
        ? '\x1b[37m    Schema:     ' + config.schema
        : ''
      ) + '\x1b[0m\n' +
      tab + '\x1b[37m    Stash:      ' + stash + '\x1b[0m\n' +
      tab + '\x1b[37m    Controller: ' + controller + '\x1b[0m\n' +
      tab + '\x1b[32m  Done.\x1b[0m\n'
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