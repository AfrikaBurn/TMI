/**
 * @file AgreementService.js
 * Agreement service controller.
 */
"use strict"


class AgreementService extends core.services.MetaService {


  /* ----- Agreed positions of Users ----- */


  /**
   * Retrieves user positions based on agreements.
   * @param {array} users     Users to retrieve agreed positions for.
   * @param {array} positions Positions to retrieve.
   */
  agreedPositions(users, positions){
    users.forEach(
      (user) => {

        user.positions = {};

        positions.forEach(
          (position) => {
            user.positions[position] = this.services[position].stash.read(
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
    )
  }
}


module.exports = AgreementService