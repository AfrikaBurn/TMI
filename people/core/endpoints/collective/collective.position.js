/**
 * @file CollectiveModifier.js
 * A basic processor template.
 */
"use strict"


class CollectiveModifier extends core.processors.UniformProcessor {


  /* ----- Request Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]:{
        'get':    [],
        'put':    [],
        'patch':  [],
        'delete': []
      }
    }
  }


  /* ----- Positionality calculation ----- */


  /**
   * Establish requesting user positionality to target collectives.
   * @inheritDoc
   */
  process(req, res){

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
          administrator: user.positions.administrator.filter(
            (collectiveId) =>
              collective.deferred.administration.indexOf(collectiveId) != -1
          ).length > 0,
          moderator: user.positions.moderator.filter(
            (collectiveId) =>
              collective.deferred.moderation.indexOf(collectiveId) != -1
          ).length > 0,
          member: user.positions.member.indexOf(collective.id) != -1,
          guest: user.positions.guest.indexOf(collective.id) != -1,
        }
        user.position.on[index].observer =
          user.position.on[index][collective.exposure] ||
          user.is[[collective.exposure]]

        user.position.owner &= user.position.on[index].owner
        user.position.administrator &= user.position.on[index].administrator
        user.position.moderator &= user.position.on[index].moderator
        user.position.member &= user.position.on[index].member
        user.position.guest &= user.position.on[index].guest
      }
    )

    user.position.owner = Boolean(user.position.owner)
    user.position.moderator = Boolean(user.position.moderator)
    user.position.administrator = Boolean(user.position.administrator)
  }
}


module.exports = CollectiveModifier