/**
 * @file PostInstaller.js
 * Post service installer.
 */
"use strict"


class PostInstaller extends core.installers.Installer{

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
      require('./base.post.schema.json'),
      'post-base'
    );

    return installed
  }
}


/* ----- Log Messages ----- */


PostInstaller.CREATING =
  '\x1b[37m  Creating \x1b[0m%s\x1b[37m post.\x1b[0m'


module.exports = PostInstaller