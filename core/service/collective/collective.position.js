/**
 * @file CollectiveModifier.js
 * A basic processor template.
 */
"use strict"


class CollectiveModifier extends core.processors.Processor {


  /* ----- Request Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'get': []
      }
    }
  }


  /* ----- Request Modification ----- */


  /**
   * Establish requesting user and target user ownership and positionality.
   * @inheritDoc
   */
  get(req, res){
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
          owner: user.id == collective.owner.id,
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


module.exports = CollectiveModifier