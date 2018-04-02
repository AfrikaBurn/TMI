/**
 * @file TmiCollectiveController.js
 * Permission aware Collective management and query controller.
 */

"use strict"


const
  Controller = require('../../core/controllers/Controller'),
  TmiController = require('./TmiController')


class TmiCollectiveController extends TmiController {


  /**
   * Create system users.
   */
  install(){
    ['Administrator', 'Moderator'].forEach(
      (label, index) => {
        if (this.service.stash.read({}, {id: index}).pop().length == 0){
          console.log(TmiCollectiveController.CREATING, label)
          this.service.stash.create(
            {id: 1},
            [TmiCollectiveController.SYSTEM_COLLECTIVES[index]]
          )
        }
      }
    )
  }
}


// ----- Log Messages -----


TmiCollectiveController.CREATING =
  '\x1b[37m    Creating \x1b[0m%s\x1b[37m collective.\x1b[0m'


// ----- System Collectives -----


TmiCollectiveController.SYSTEM_COLLECTIVES = [
  {
    name: 'Administrators',
    description: 'System administrators of this community.',
    status: 'active'
  },
  {
    name: 'Moderators',
    description: 'System moderators of this community.',
    status: 'active'
  }
]


module.exports = TmiCollectiveController