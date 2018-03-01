/**
 * @file MongoService.js
 * MongoDB minion minion
 *
 * Requires host and port attributes to be set schema section of config.json:
 *
 * "mongo-example": {
 *   "minion": "MongoService",
 *   "host": "localhost",
 *   "port": 27017
 * }
 *
 */

"use strict"


const
  Service = require('../Service'),
  MongoClient = require('mongodb').MongoClient,
  assert = require('assert')


module.exports = class MongoService extends Service{

  /**
   * @inherit
   */
  constructor(minimi, path, name, schema){
    super(minimi, path, name, schema)
  }

  /**
   * Connects to Mongodb and executes a callback with reference to the db
   * @param  {Function} callback to call with a database
   */
  connect(callback){
    MongoClient.connect(
      'mongodb://' + this.config.host + ':' + this.config.port + '/' + this.minimi.config.name,
      (error, db) => {
        if (error) throw new Error(error)
        callback(db)
      }
    )
  }

  /**
   * @inheritDoc
   */
  get(request, response){
    var thisObject = this
    if (request.header('Accept') == 'application/json')
      this.connect(
        (db) => {
          db.collection(thisObject.name).find(request.query).toArray(
            (error, docs) => {
              if (error) throw new Error(error)
              response.send(docs)
              db.close()
            }
          )
        }
      )
    else return super.get(request, response)
  }

  /**
   * @inheritDoc
   */
  post(request, response){
    var thisObject = this
    this.connect(
      (db) => {
        db.collection(thisObject.name).insertMany(
          [request.body],
          (error, result) => {
            if (error) throw new Error(error)
            response.send(result.ops)
            db.close()
          }
        )
      }
    )
  }

  /**
   * @inheritDoc
   */
  put(request, response){
    var thisObject = this
    this.connect(
      (db) => {
        db.collection(thisObject.name).updateOne(
          request.query,
          {$set: request.body},
          (error, result) => {
            if (error) throw new Error(error)
            response.send(result.ops)
            db.close()
          }
        )
      }
    )
  }

  /**
   * @inheritDoc
   */
  delete(request, response){
    var thisObject = this
    this.connect(
      (db) => {
        db.collection(thisObject.name).deleteOne(
          request.query,
          (error, result) => {
            if (error) throw new Error(error)
            response.send(result.result.n)
            db.close()
          }
        )
      }
    )
  }

  /**
   * @inheritDoc
   */
  patch(request, response){
    // TODO: write patching
  }

}

module.exports = MongoService