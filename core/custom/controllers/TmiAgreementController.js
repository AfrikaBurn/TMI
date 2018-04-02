/**
 * @file TmiAgreementController.js
 * Agreement controller.
 */

"use strict"


const
  TmiSchemaController = require('./TmiSchemaController')


class TmiAgreementController extends TmiSchemaController {


  // ----- Process -----


  /**
   * Install system agreements.
   * @inheritDoc
   */
  install(){
    ['Administrator', 'Moderator', 'Member'].forEach(

      (name) => {

        console.log(TmiAgreementController.CREATING, name)

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
        'use': [(req, res, next) => {this.userPositions(req, res, next)}]
      },
      'user': {
        'get': [(req, res, next) => {this.userMemberships(req, res, next)}]
      }
    }
  }

  /**
   * Loads position agreements of the requesting user.
   */
  userPositions(req, res, next){
    req.user.positions = {

      member: this.services.member.stash.read(
        req.user,
        {
          promisor: {
            entityType: 'user',
            id: req.user.id,
          }
        }
      )[1].reduce(
        (collectives, agreement) => collectives.concat(agreement.promisee.id),
        []
      ),

      moderator: this.services.moderator.stash.read(
        req.user,
        {
          promisor: {
            entityType: 'user',
            id: req.user.id,
          }
        }
      )[1].reduce(
        (collectives, agreement) => collectives.concat(agreement.promisee.id),
        []
      ),

      administrator: this.services.administrator.stash.read(
        req.user,
        {
          promisor: {
            entityType: 'user',
            id: req.user.id,
          }
        }
      )[1].reduce(
        (collectives, agreement) => collectives.concat(agreement.promisee.id),
        []
      )
    }
    next()
  }

  /**
   * Load membership agreements of target users.
   */
  userMemberships(req, res, next){
    req.targets.forEach(
      (target) => {

        target.memberships = this.services.member.stash.read(
          req.user,
          {
            promisor: {
              entityType: 'user',
              id: target.id,
            }
          }
        )[1].reduce(
          (collectives, agreement) => collectives.concat(agreement.promisee.id),
          []
        )

      }
    )
    next()
  }
}


// ----- Log Messages -----


TmiAgreementController.CREATING =
  '\x1b[37m    Creating \x1b[0m%s\x1b[37m agreement.'



module.exports = TmiAgreementController