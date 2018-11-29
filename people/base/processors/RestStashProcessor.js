/**
 * @file RestStashProcessor.js
 * Basic RESTful processor for basic HTTP methods with persistance.
 */
"use strict"


const
  RestProcessor = require('./RestProcessor')


class RestStashProcessor extends RestProcessor {


  /* ----- Method responders ----- */


  /**
   * Process a GET request from storage.
   * @inheritDoc
   */
  get(req, res) {
    return req.header('Content-Type') == 'application/json;schema'
      ? { code: 200, schema: this.endpoint.schema }
      : this.endpoint.stash.read(req.user, req.query)
  }

  /**
   * Process a POST request and persists to stash storage.
   * @inheritDoc
   */
  post(req, res) {
    return this.endpoint.stash.create(req.user, req.body)
  }

  /**
   * Process a PUT request and persists to stash storage.
   * @inheritDoc
   */
  put(req, res) {
    return this.endpoint.stash.update(req.user, req.query, req.body)
  }

  /**
   * Process a PATCH request and persists to stash storage.
   * @inheritDoc
   */
  patch(req, res) {
    return this.endpoint.stash.update(req.user, req.query, req.body)
  }

  /**
   * Process a DELETE request and persists to stash storage.
   * @inheritDoc
   */
  delete(req, res) {
    return this.endpoint.stash.delete(req.user, req.query)
  }
}


module.exports = RestStashProcessor