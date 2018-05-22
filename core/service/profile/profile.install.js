/**
 * @file ProfileInstaller.js
 * Profile service installer.
 */
"use strict"


class ProfileInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return true
  }

  /**
   * @inheritDoc
   */
  install(){

    var installed = true;

    core.stashes.Stash.VALIDATOR.addSchema(
      require('./base.profile.schema.json'),
      'profile-base'
    );

    return installed
  }
}


/* ----- Log Messages ----- */


ProfileInstaller.CREATING =
  '\x1b[37m  Creating \x1b[0m%s\x1b[37m profile.\x1b[0m'


module.exports = ProfileInstaller