/**
 * @file Installer.js
 * Base installer.
 */
"use strict"


class Installer {


  /* ----- Construction ----- */


  /**
   * Constructs a new Processor.
   * @param {object} endpoint Endpoint this installer belongs to.
   */
  constructor(endpoint){
    this.endpoint = endpoint
  }

  /**
   * Checks whether installation tasks are to be performed.
   * @returns {boolean} true if installations tasks should be performed.
   */
  toInstall(){ return false }

  /**
   * Performs installation tasks.
   * @returns {boolean} true if installation was successfull.
   */
  install(){ return true }
}


module.exports = Installer