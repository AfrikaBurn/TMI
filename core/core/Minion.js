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

    this.schema = config.schema ? require('../schema/' + config.schema) : false;
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
      locations = [
        '../custom/' + type + '/',
        './' + type + '/'
      ]

    for (let i in locations){

      var
        localPath = locations[i] + name + '.js',
        fullPath = path.resolve(__dirname + '/' + localPath),
        exists = fs.existsSync(fullPath)

      if (fs.existsSync(fullPath)) return new (require(localPath))(this)
    }

    throw new Error(name + ' not found in ' + type)
  }
}


module.exports = Minion