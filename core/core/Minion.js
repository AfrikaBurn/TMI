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
  constructor(path, minimi){

    this.minimi = minimi
    this.path = path

    var
      config = this.getConfig(),
      service = config.service
        ? config.service
        : 'Service',
      stash = config.stash
        ? config.stash
        : false

    this.schema = config.schema ? this.find('schemas', config.schema) : false;
    this.stash = stash ? this.find('stashes', stash) : false
    this.service = this.find('services', service)

    console.log(
      '  Spawning nanoservice minion at ' + path + ':\n' +
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
    return this.minimi.config.minions[this.path]
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