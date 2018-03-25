/**
 * @file Minion.js
 * Basic configurable object.
 */

"use strict"


const
fs = require('fs'),
path = require('path')


class Minion {


  // ----- Process -----


  /**
   * Constructs a new minion
   * @param  {string} name   Minion name
   * @param  {object} minimi main boot strap
   */
  constructor(name, minimi){

    this.name = name
    this.minimi = minimi

    var
      config = this.getConfig(),
      service = config.service
        ? typeof config.service == 'string'
          ? config.service
          : config.service.name
        : 'Service',
      stash = config.stash
        ? typeof config.stash == 'string'
          ? config.stash
          : config.stash.name
        : 'Stash',
      path = config.path || config.schema

    this.schema = config.schema ? this.find('schemas', config.schema) : false;
    this.stash = this.find('stashes', stash)
    this.service = this.find('services', service)

    console.log(
      '  Spawning ' + name + ' minion\n' +
      '    Path:    ' + path + '\n' +
      (config.schema ? '    Schema:  ' + config.schema + '\n' : '' ) +
      '    Stash:   ' + stash + '\n' +
      '    Service: ' + service + '\n'
    )
  }

  /**
   * Dispose of the minion.
   */
  dispose(){
    this.service.detach()
    this.stash.close()
  }


  // ----- Accessors -----


  /**
   * Returns the config for this minion
   */
  getConfig(){
    return this.minimi.config.minions[this.name]
  }


  // ----- Utility -----


  /**
   * Locates and instantiates a Service or Stash
   * @param  {string} type   services|stashes
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


module.exports = Minion