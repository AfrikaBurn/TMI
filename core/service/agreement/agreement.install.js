/**
 * @file AgreementInstaller.js
 * User service installer.
 */
"use strict"


class AgreementInstaller extends core.installers.Installer{

  /**
   * @inheritDoc
   */
  toInstall(){
    return this.service.stash.read(
      {id: -1},
      [
        {name: "Administrator"},
        {name: "Moderator"},
        {name: "Member"},
        {name: "Guest"}
      ]
    ).entities.length != 4
  }

  /**
   * @inheritDoc
   */
  install(){

    var installed = true;

    core.stashes.Stash.VALIDATOR.addSchema(
      require('./base.agreement.schema.json'),
      'agreement-base'
    );

    ['Administrator', 'Moderator', 'Member', 'Guest'].forEach(

      (name) => {

        console.log(AgreementInstaller.CREATING, name)

        var machineName = name.toLowerCase()

        try{

          this.service.processors.execute.post(
            {
              user: { id: -1, is: { administrator: true }},
              body: [{
                owner: {entityType: 'collective', id: 0},
                name: machineName,
                schema: require(
                  './install/' + machineName + '.agreement.schema.json'
                )
              }]
            }
          )

          this.service.services[machineName].processors.execute.post(
            {
              user: { id: -1, is: { administrator: true }},
              body: [{
                promisor: {entityType: 'user', id: 1},
                promisee: {entityType: 'collective', id: 0},
              }]
            }
          )

        } catch (e) {
          utility.log(e)
          installed = false
        }
      }
    )

    return installed
  }
}


/* ----- Log Messages ----- */


AgreementInstaller.CREATING =
  '\x1b[37m  Creating \x1b[0m%s\x1b[37m agreement.\x1b[0m'



module.exports = AgreementInstaller