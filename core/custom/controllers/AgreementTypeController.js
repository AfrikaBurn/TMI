/**
 * @file AgreementTypeController.js
 * Agreement controller.
 */

"use strict"


const
  SchemaController = require('./SchemaController')


class AgreementTypeController extends SchemaController {


  // ----- Process -----


  /**
   * Install system agreements.
   * @inheritDoc
   */
  install(){
    ['Administrator', 'Moderator', 'Member'].forEach(

      (name) => {

        console.log(AgreementTypeController.CREATING, name)

        var machineName = name.toLowerCase()

        this.postRoute(
          {
            user: { id: 1, is: { administrator: true }},
            body: [{
              owner: {entityType: 'collective', id: 0},
              name: name,
              schemaType: 'agreement',
              schema: require(
                '../schemas/agreements/' +
                machineName +
                '.agreement.schema.json'
              )
            }]
          }
        )

        this.services[machineName].controller.postRoute(
          {
            user: { id: 1, is: { administrator: true }},
            body: [{
              promisor: {entityType: 'user', id: 1},
              promisee: {entityType: 'collective', id: 0},
            }]
          }
        )
      }
    )
  }


  // ----- Request Loading -----


  /**
   * Add agreement loading to requests.
   * @inheritDoc
   */
  loaders(){
    return {
      '': {
        'use': [
          (req, res, next) => {
            this.loadUserPositions(req.user);
            next()
          }
        ]
      },
      'user': {
        'get': [
          (req, res, next) => {
            this.loadUserMemberships(req.user, req.target.users)
            next()
          }
        ]
      }
    }
  }


  /**
   * Loads positional agreements of the requesting user.
   * @param {object} user User to load positional agreements for.
   */
  loadUserPositions(user){
    user.positions = {

      member: this.services.member.stash.read(
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
      ),

      moderator: this.services.moderator.stash.read(
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
      ),

      administrator: this.services.administrator.stash.read(
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
  }

  /**
   * Load membership agreements of target users.
   * @param {object} user requesting user.
   * @param {object} users target users to load membership agreements for.
   */
  loadUserMemberships(user, users){
    users.forEach(
      (target) => {

        target.memberships = this.services.member.stash.read(
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


// ----- Log Messages -----


AgreementTypeController.CREATING =
  '\x1b[37m    Creating \x1b[0m%s\x1b[37m agreement.'



module.exports = AgreementTypeController