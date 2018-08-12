/**
 * @file UserInstaller.js
 * User service installer.
 */
"use strict"


class UserInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return this.service.stash.read(
      {id: -1},
      [{id: 0}]
    ).entities.length == 0
  }

  /**
   * @inheritDoc
   */
  install(){
    ['Anonymous', 'Administrator'].forEach(
      (label, index) => {
        try{
          if (this.service.stash.read({}, {id: index}).entities.length == 0){
            console.log(UserInstaller.CREATING, label)
            this.service.stash.create(
              {id: 1},
              [UserInstaller.SYSTEM_ACCOUNTS[index]]
            )
          }
        } catch(e) {
          console.log(e)
          return false
        }
      }
    )
    return true
  }
}


/* ----- Log Messages ----- */


UserInstaller.CREATING =
  '\x1b[37m    Creating \x1b[0m%s\x1b[37m user.\x1b[0m'


/* ----- System Accounts ----- */


UserInstaller.SYSTEM_ACCOUNTS = [
  {
    'username': 'Anonymous', 'password': 'none',
    'status': 'active',
    'email': { 'value': 'no-reply@system.com', 'privacy': 'owner'}
  },
  {
    'username': 'Administrator', 'password': 'Administrator',
    'status': 'active',
    'email': { 'value': 'no-reply@system.com', 'privacy': 'owner'}
  }
]


module.exports  = UserInstaller