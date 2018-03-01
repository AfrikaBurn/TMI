/**
 * @file Minion.js
 * Basic configurable object.
 */

"use strict"


module.exports = class Minion {

  /**
   * Creates a new minion
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

    this.service = this.find('services', service)
    this.stash = this.find('stashes', stash)
    this.schema = require('../schema/' + config.schema)

    console.log(
      '  Spawning ' + name + ' minion\n' +
      '    Stash:   ' + stash + '\n' +
      '    Schema:  ' + config.schema + '\n' +
      '    Service: ' + service + '\n' +
      '    Path:    ' + path + '\n'
    )
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
        './' + type + '/',
        './'
      ],
      found = false,
      error = false

    for (let i in locations){
      try{
        found = new (require(locations[i] + name + '.js'))(this)
      } catch (e) {
        if (e.code != 'MODULE_NOT_FOUND') error = e
      }
    }

    if (error) throw error
    if (found) return found
    else throw new Error(name + ' not found in ' + type)
  }

  /**
   * Dispose of the minion.
   */
  dispose(){
    this.service.detach()
    this.stash.close()
  }
}
