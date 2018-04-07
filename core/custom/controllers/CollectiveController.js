/**
 * @file CollectiveController.js
 * Permission aware Collective management and query controller.
 */

"use strict"


const
  CoreController = require('../../core/controllers/CoreController'),
  Controller = require('./Controller')


class CollectiveController extends Controller {


  // ----- Process -----


  /**
   * Create system collectives.
   * @inheritDoc
   */
  install(){
    ['Administrator', 'Community'].forEach(
      (label, index) => {
        if (this.service.stash.read({}, {id: index}).entities.length == 0){
          console.log(CollectiveController.CREATING, label)
          this.service.stash.create(
            {id: 1},
            [CollectiveController.SYSTEM_COLLECTIVES[index]]
          )
        }
      }
    )
  }


  // ----- Request Loading -----


  /**
   * Load request target collective IDs.
   * @inheritDoc
   */
  getLoad(req, res){

    var user = req.user

    req.target = req.target || {}
    req.target.collectives = this.service.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id', 'owner', 'defer']
      }
    ).entities

    req.target.collectives.forEach(
      (collective) => {
        collective.deferred = {
          moderation: this.traceDeferChain(
            req.user,
            collective,
            'moderation'
          ),
          administration: this.traceDeferChain(
            req.user,
            collective,
            'administration'
          )
        }
      }
    )
  }

  /**
   * Get the deferred administration or moderation chain of a collective.
   * @param {object} user Requesting user.
   * @param {object} collective Collective to trace.
   * @param {string} type Deference type to trace [administrator|moderator].
   */
  traceDeferChain(user, collective, type){

    var deferedTo = [collective.id]

    if (collective.defer && collective.defer[type]) {
      deferedTo.concat(
        this.traceDeferChain(
          user,
          this.service.stash.read(
            user,
            {id: collective.defer[type].id},
            {
              process: false,
              fields: ['id', 'defer']
            }
          ).entities[0],
          type
        )
      )
    }

    return deferedTo
  }


  // ----- Request Modification -----


  /**
   * Establish requesting user and target user ownership and positionality.
   * @inheritDoc
   */
  getModify(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      moderator: true,
      administrator: true,
      on: []
    }

    req.target.collectives.forEach(

      (collective, index) => {

        user.position.on[index] = {
          owner: user.id == collective.owner.id || user.is.administrator,
          member: user.positions.member.indexOf(collective.id) != -1,
          moderator: user.positions.moderator.filter(
            (collectiveId) =>
              collective.deferred.moderation.indexOf(collectiveId) != -1
          ).length > 0,
          administrator: user.positions.administrator.filter(
            (collectiveId) =>
              collective.deferred.administration.indexOf(collectiveId) != -1
            ).length > 0
          }

        user.position.owner &= user.position.on[index].owner
        user.position.moderator &= user.position.on[index].moderator
        user.position.administrator &= user.position.on[index].administrator
      }
    )

    user.position.owner = Boolean(user.position.owner)
    user.position.moderator = Boolean(user.position.moderator)
    user.position.administrator = Boolean(user.position.administrator)
  }
}


// ----- Log Messages -----


CollectiveController.CREATING =
  '\x1b[37m    Creating \x1b[0m%s\x1b[37m collective.\x1b[0m'


// ----- System Collectives -----


CollectiveController.SYSTEM_COLLECTIVES = [
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
    defer:{
      moderation: {id: 0},
      administration: {id: 0}
    }
  }
]


module.exports = CollectiveController