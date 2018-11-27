/**
 * @file load.js
 * Agreement loading.
 */
"use strict"


class AgreementLoader extends core.processors.Processor{


  /* ----- Routing ----- */


  /**
   * @inheritDoc
   */
  routes(path){
    return {
      [path]: {
        'all': [
          core.processors.Processor.PARSE_QUERY,
          (req, res, next) => {
            this.loadTargetAgreements(req)
            next()
          }
        ]
      }
    }
  }


  /* ----- Utility ----- */


  /**
   * Load request target agreement IDs and owners.
   * @param {object} req Express request object
   */
  loadTargetAgreements(req){

    req.target = req.target || {}

    req.target.agreements = this.endpoint.stash.read(
      req.user,
      req.query,
      {
        process: false,
        fields: ['id', 'owner']
      }
    ).entities

    req.exising = req.exising || {}

  }
}


module.exports = AgreementLoader