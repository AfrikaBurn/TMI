/**
 * @file UserPosition.js
 * A basic processor template.
 */
"use strict"


class UserPosition extends core.processors.UniformProcessor {


  /* ----- Positionality calculation ----- */


  /**
   * Establish requesting user positionality to target users.
   * @inheritDoc
   */
  process(req, res){

    var
      user = req.user,
      users = req.target.users

    bootstrap.endpoints['/agreement'].agreedPositions(
      req.target.users,
      ['member']
    )

    user.position = {
      owner: true,
      moderator: true,
      administrator: true,
      on: []
    }

    users.forEach(

      (target, index) => {

        user.position.on[index] = {
          owner: user.id == target.id || user.is.administrator,
          member: user.positions.member.filter(
            (collectiveId) => target.positions.member.indexOf(collectiveId) >= 0
          ).length > 0,
          moderator: user.positions.moderator.filter(
            (collectiveId) => target.positions.member.indexOf(collectiveId) >= 0
          ).length > 0,
          administrator: user.positions.administrator.filter(
            (collectiveId) => target.positions.member.indexOf(collectiveId) >= 0
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

    if (req.header('Content-Type') == 'application/json;position'){
      throw { code: 200, position: user.position, expose: true }
    }
  }
}


module.exports  = UserPosition