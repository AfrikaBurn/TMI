/**
 * @file Endpoint.js
 * A base endpoint controller.
 */
"use strict"


const
  fs = require('fs'),
  pathUtil = require('path')


class Endpoint {


  /* ----- Construction ----- */


  /**
   * Creates a new Endpoint.
   * @param {string} name         Endpoint name.
   * @param {object} parent       Parent endpoint.
   * @param {object} url          Endpoint URL
   * @param {object} source       Source folder.
   * @param {object} schemaSource Endpoint schema.
   */
  constructor(name, parent, url = false, source = false, schemaSource = false){

    this.name = name
    this.parent = parent
    this.url = url || (parent.url == '/' ? '' : parent.url) + '/' + name
    this.source = source || parent.source + '/' + name
    this.schemaSource = schemaSource

    this.processors = {}
    this.children = []

    bootstrap.endpoints[this.url] = this

    utility.log(
      '\x1b[0mLoading ' +
      'endpoint at \x1b[1m' + this.url +
      '\n\x1b[37mfrom ' + this.source + '\x1b[0m',
      {indent: 2}
    )

    this.loadSchema()
    this.loadStash()
    this.loadProcessors()
    this.loadChildren()

    utility.log(
      '\x1b[32mDone loading endpoint at ' + this.url + '\x1b[0m\n',
      {indent: 2}
    )
  }

  /**
   * Stops a endpoint
   */
  stop(){
    // TODO
  }


  /* ----- Loading ----- */


  /**
   * Load the endpoint schema.
   */
  loadSchema(){
    try{

      this.schema = this.schemaSource || require(
        this.getLoadName('schema.json')
      )
      core.stashes.Stash.VALIDATOR.addSchema(this.schema, this.name)

      utility.log(
        this.schemaSource
        ? '\x1b[0mschema\x1b[1m\t\t\tOBJECT\x1b[0m'
        : '\x1b[0mschema\x1b[1m\t\t\t' + this.name + '.schema.json\x1b[0m',
        {indent: 4}
      )

    } catch(error){
      if (error.code != 'MODULE_NOT_FOUND') throw utility.error(
        Endpoint.INVALID_SCHEMA,
        [error.message]
      )
      utility.log('\x1b[37mschema\t\t\tNONE\x1b[0m', {indent: 4})
    }
  }

  /**
   * Load the endpoint stash, inherit from parent if that fails.
   */
  loadStash(){

    try{

      var name = this.getLoadName('stash.js')

      this.stash = new (require(name))(
        this.name,
        bootstrap.config.endpoints[this.url],
        this.schema
      )

      utility.log(
        '\x1b[0mstash\x1b[1m\t\t\t' +
        pathUtil.relative(this.source, name) +
        '\x1b[0m',
        {indent: 4}
      )

    } catch(error){
      if (error.code == 'MODULE_NOT_FOUND'){
        this.stash = this.getStash()
        utility.log(
          this.stash
            ? '\x1b[0mstash\x1b[0m inherited'
            : '\x1b[37mstash\t\t\tNONE\x1b[0m',
          {indent: 4}
        )
      } else throw error
    }

    if (this.stash instanceof core.stashes.MemoryStash){
      utility.log(
        '\x1b[33mWARNING: Memory stashes intended for testing only!\n' +
        '\x1b[33mThey evaporate once the server stops!\x1b[0m',
        {indent: 4, verbose: false, once: true}
      )
    }

    return true
  }

  /**
   * Loads the processors of this endpoint.
   */
  loadProcessors(){

    for (let phase in bootstrap.routers){
      try{

        var
          path = this.getLoadName(phase + '.js'),
          Processor = require(path),
          processor = new Processor(this),
          displayPath = pathUtil.relative(this.source, path)

        processor.attach(this.url, bootstrap.routers[phase])
        this.processors[phase] = processor

        utility.log(
          phase + ' processor \x1b[1m\t\t' + displayPath + '\x1b[0m',
          {indent: 4}
        )

      } catch (e) {
        if (e.code == 'MODULE_NOT_FOUND'){
          this.processors[phase] = false
          utility.log(
            '\x1b[37m' + phase + ' processor \t\tNONE\x1b[0m',
            {indent: 4}
          )
        } else {
          utility.log(e)
          return false
        }
      }
    }

    return true
  }

  /**
   * Loads child controllers.
   */
  loadChildren(){

    var
      loaded = true,
      names = fs.readdirSync(this.source).filter(
        file => fs.statSync(
          this.source + '/' + file
        ).isDirectory()
      )

      names.forEach((name) => {

        var child

        try{

          child = new (
            require(this.source + '/' + name + '/' + name + '.endpoint.js')
            )(
              name,
              this
            )

        } catch (e) {

          if (e.code != 'MODULE_NOT_FOUND') {
            throw e
            utility.log(e)
          }

          child = new Endpoint(
            name,
            this
          )
        }

        this.children.push(child)
      }
    )
  }


  /* ----- Installation ----- */


  /**
   * Performs installation tasks if applicable.
   */
  install(){

    var installed = true

    try{

      var
        path = this.getLoadName('install.js'),
        installer = new (require(path))(this)

      if (installer.toInstall()) {

        utility.log(
          '\x1b[0mInstalling \x1b[1m' + this.name,
          {indent: 2}
        )

        installed = installer.install()

        utility.log(
          installed
            ? '\x1b[32mDone installing ' + this.name + '.\x1b[0m\n'
            : '\x1b[31mFAILED installing ' + this.name + '.\x1b[0m!\n',
          {indent: 2}
        )

      } else {

        utility.log(
          '\x1b[37m' +
          this.name +
          ' install\t\t\x1b[37mNOTHING TO DO\n',
          {indent: 4}
        )

      }

    } catch (e) {
      if (e.code != 'MODULE_NOT_FOUND'){
        utility.log(e)
        installed = false
      }
    }

    if (installed) this.children.some(
      (child) => {
        installed &= child.install()
        return !installed
      }
    )

    return installed
  }


  /* ----- Utility ----- */


  /**
   * Generate a source file load name.
   */
  getLoadName(extension = '') {

    var
      sourceName = this.source.split('/').pop(),
      dotExtension = extension ? '.' + extension : ''

    return [
      this.source + '/' + this.name + dotExtension,
      this.source + '/' + sourceName + dotExtension,
      '.'
    ].filter(path => fs.existsSync(path)).shift()
  }

  /**
   * Gets a stash by checking ancestors.
   */
  getStash(){
    return this.stash
      ? this.stash
      : typeof this.parent == 'Endpoint'
        ? this.parent.getStash()
        : false
  }
}


// ----- Response Types -----


Endpoint.INVALID_SCHEMA = {
  error: "Invalid schema", code: 422, expose: true
}


module.exports = Endpoint