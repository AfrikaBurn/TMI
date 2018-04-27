/**
 * @file Installer.js
 * Base installer.
 */
"use strict"


class Installer {


  /* ----- Construction ----- */


  /**
   * Constructs a new Processor.
   * @param {object} service Service this installer belongs to.
   */
  constructor(service){
    this.service = service
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