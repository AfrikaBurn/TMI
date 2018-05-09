/**
 * @file AgreementLoader.js
 * User access processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class AgreementLoader extends core.processors.RestProcessor {


  /* ----- Request Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      '': {
        'use': [
          (req, res, next) => {
            this.loadUserPositions(req.user);
            next()
          }
        ]
      },
      '/user': {
        'get': [
          (req, res, next) => {
            this.loadTargetMemberships(req.user, req.target.users)
            next()
          }
        ]
      }
    }
  }


  // ----- Request Loading -----


  /**
   * Loads positional agreements of the requesting user.
   * @param {object} user User to load positional agreements for.
   */
  loadUserPositions(user){

    user.positions = {};

    ['administrator', 'moderator', 'member', 'guest'].forEach(
      (position) => {
        user.positions[position] = this.service.services[position].stash.read(
          user,
          {
            promisor: {
              entityType: 'user',
              id: user.id,
            }
          }
        ).entities.reduce(
          (collectives, agreement) => collectives.concat(agreement.promisee.id),
          []
        )
      }
    )
  }

  /**
   * Load membership agreements of target users.
   * @param {object} user requesting user.
   * @param {object} users target users to load membership agreements for.
   */
  loadTargetMemberships(user, users){
    users.forEach(
      (target) => {

        target.memberships = this.service.services.member.stash.read(
          user,
          {
            promisor: {
              entityType: 'user',
              id: target.id,
            }
          }
        ).entities.reduce(
          (collectives, agreement) => collectives.concat(agreement.promisee.id),
          []
        )

      }
    )
  }
}


module.exports = AgreementLoader