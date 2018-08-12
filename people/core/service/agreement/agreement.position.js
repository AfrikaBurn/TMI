/**
 * @file AgreementPosition.js
 * User access processor.
 */
"use strict"


const
  Processor = core.processors.Processor


class AgreementPosition extends core.processors.UniformProcessor {


  /* ----- Request Routing ----- */


  /**
   * Adds middleware to load user and target user positionality.
   * @inheritDoc
   */
  routes(path){
    return {
      [path]:{
        'get':    [],
        'put':    [],
        'patch':  [],
        'delete': [],
      }
    }
  }


  /* ----- Positionality calculation ----- */


  /**
   * Loads user ownership of target agreements.
   * @inheritDoc
   */
  process(req, res){

    var
      user = req.user

    user.position = {
      owner: true,
      on: []
    }

    req.target.agreements.forEach(
      (agreement, index) => {
        user.position.on[index] = {
          owner: agreement.owner.type === 'user'
            ? agreement.owner.id === user.id
            : user.positions.administrator.indexOf(agreement.owner.id) >= 0
        }

        user.position.owner &= user.position.on[index].owner
      }
    )

    user.position.owner = Boolean(user.position.owner)
  }
}


module.exports = AgreementPosition