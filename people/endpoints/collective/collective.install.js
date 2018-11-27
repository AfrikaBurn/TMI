/**
 * @file CollectiveInstaller.js
 * User endpoint installer.
 */
"use strict"


class CollectiveInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return this.endpoint.stash.read(
      {id: -1},
      [{id: 0}, {id: 1}]
    ).entities.length != 2
  }

  /**
   * @inheritDoc
   */
  install(){

    var installed = true;

    ['Administrator', 'Community'].forEach(
      (label, index) => {
        try{
          if (this.endpoint.stash.read({}, {id: index}).entities.length == 0){

            utility.log(
              '\x1b[37mCreating \x1b[0m' +
              label +
              '\x1b[37m collective.\x1b[0m',
              {indent: 4}
            )

            this.endpoint.stash.create(
              {id: -1},
              [CollectiveInstaller.SYSTEM_COLLECTIVES[index]]
            )
          }
        } catch(e) {
          utility.log(e)
          installed = false
        }
      }
    )

    return installed
  }
}


/* ----- System Collectives ----- */


CollectiveInstaller.SYSTEM_COLLECTIVES = [
  {
    name: 'System',
    description: 'System operators of this tribe.',
    status: 'active',
    owner: {
      entityType: 'user',
      id: -1
    }
  },
  {
    name: 'Participants',
    description: 'Tribe participation group.',
    status: 'active',
    owner: {
      id: -1
    },
    delegate:{
      moderation: {id: 0},
      administration: {id: 0}
    }
  }
]


module.exports = CollectiveInstaller