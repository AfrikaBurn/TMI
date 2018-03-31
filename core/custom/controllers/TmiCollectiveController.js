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


TmiCollectiveController.CREATING = '    Created \x1b[1m%s\x1b[0m collective.'


// ----- System Collectives -----


TmiCollectiveController.SYSTEM_COLLECTIVES = [
  {
    'name': 'Administrators',
    'description': 'System administrators of this community.',
    'status': 'draft'
  },
  {
    'name': 'Administrators',
    'description': 'System moderators of this community.',
    'status': 'draft'
  }
]


module.exports = TmiCollectiveController