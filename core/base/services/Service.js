/**
 * @file Service.js
 * A base service controller.
 */
"use strict"


const
  fs = require('fs'),
  pathUtil = require('path'),
  bodyParser = require('body-parser'),
  Processor = require('../processors/Processor')


class Service {


  /* ----- Construction ----- */


  /**
   * Creates a new Service.
   * @param {string} name         Service name.
   * @param {object} parent       Parent service.
   * @param {object} url          Service URL
   * @param {object} source       Source folder.
   * @param {object} schemaSource Service schema.
   */
  constructor(name, parent, url = false, source = false, schemaSource = false){

    this.name = name
    this.parent = parent
    this.url = url || (parent.url == '/' ? '' : parent.url) + '/' + name
    this.source = source || parent.source + '/' + name
    this.schemaSource = schemaSource

    this.processors = {}
    this.children = []

    core.log(
      '\x1b[0mLoading ' +
      'service at \x1b[1m' + this.url +
      '\n\x1b[37mfrom ' + this.source + '\x1b[0m',
      2
    )

    this.loadSchema()
    this.loadStash()
    this.loadProcessors()

    core.log('\x1b[32mDone loading service at ' + this.url + '\x1b[0m\n', 2)

    this.loadChildren()
  }


  /* ----- Loading ----- */


  /**
   * Load the service schema.
   */
  loadSchema(){
    try{

      this.schema = this.schemaSource || require(
        this.getLoadName('schema.json')
      )
      core.stashes.Stash.VALIDATOR.addSchema(this.schema, this.name)

      core.log(
        this.schemaSource
        ? '\x1b[0mschema\x1b[1m\t\t\tOBJECT\x1b[0m'
        : '\x1b[0mschema\x1b[1m\t\t\t' + this.name + '.schema.json\x1b[0m',
        4
      )

    } catch(error){
      if (error.code != 'MODULE_NOT_FOUND') core.log(error)
      core.log('\x1b[37mschema\t\t\tNONE', 4)
    }
  }

  /**
   * Load the service stash, inherit from parent if that fails.
   */
  loadStash(){

    try{

      this.stash = new (require(this.getLoadName('stash.js')))(
        this.name,
        core.config.services[this.url],
        this.schema
      )

      core.log('\x1b[0mstash\x1b[1m\t\t\t' + this.name + '.stash.js\x1b[0m', 4)

    } catch(e){
      if (e.code == 'MODULE_NOT_FOUND'){
        this.stash = this.getStash()
        core.log(
          this.stash
            ? '\x1b[0mstash\x1b[0m inherited'
            : '\x1b[37mstash\t\t\tNONE',
          4
        )
      } else {
        core.log(e.stack)
      }
    }

    if (this.stash instanceof core.stashes.MemoryStash){
      core.log(
        '\x1b[33mWARNING: Memory stashes intended for testing only!\n' +
        '\x1b[33mThey evaporate once the server stops!',
        4
      )
    }
  }

  /**
   * Loads the processors of this service.
   */
  loadProcessors(){
    for (let phase in core.routers){
      try{

        var
          path = this.getLoadName(phase + '.js'),
          Processor = require(path),
          processor = new Processor(this),
          displayPath = pathUtil.relative(this.source, path)

        processor.attach(this.url, core.routers[phase])
        this.processors[phase] = processor

        core.log(phase + ' processor \x1b[1m\t\t' + displayPath + '\x1b[0m', 4)

      } catch (e) {
        if (e.code == 'MODULE_NOT_FOUND'){
          this.processors[phase] = false
          core.log('\x1b[37m' + phase + ' processor \t\tNONE', 4)
        } else {
          core.log(e)
        }
      }
    }
  }

  /**
   * Loads child controllers.
   */
  loadChildren(){

    var
      names = fs.readdirSync(this.source).filter(
        file => fs.statSync(
          this.source + '/' + file
        ).isDirectory()
      )

      names.forEach((name) => {

        try{

          this[name] = new (
            require(this.source + '/' + name + '/' + name + '.service.js')
            )(
              name,
              this
            )

        } catch (e) {

          if (e.code != 'MODULE_NOT_FOUND') core.log(e)
          this[name] = new Service(
            name,
            this
          )
        }

        this.children.push(this[name])
      }
    )
  }


  /* ----- Installation ----- */


  /**
   * Performs installation tasks if applicable.
   */
  install(){

    try{

      var
        path = this.getLoadName('install.js'),
        installer = new (require(path))(this)

      if (installer.toInstall()) {

        core.log('\x1b[0mInstalling \x1b[1m' + this.name, 2)

        core.log(
          installer.install()
            ? '\x1b[32mDone installing ' + this.name + '.\x1b[0m\n'
            : '\x1b[31mFAILED installing ' + this.name + '.\x1b[0m!\n',
          2
        )

      } else {

        core.log(
          '\x1b[37m' +
          this.name +
          ' install\t\t\x1b[37mNOTHING TO DO\n',
          4
        )

      }

    } catch (e) {
      if (e.code != 'MODULE_NOT_FOUND'){
        core.log(e)
      }
    }

    this.children.forEach(
      (child) => child.install()
    )
  }


  /* ----- Utility ----- */


  /**
   * Returns the names of children to load
   */
  getChildrenNames(){
    return fs.readdirSync(this.source).filter(
      (file) => fs.statSync(
        this.source + '/' + file
      ).isDirectory()
    )
  }

  /**
   * Generate a source file load name.
   */
  getLoadName(extension = '') {

    var
      sourceName = this.source.split('/').pop(),
      extension = extension ? '.' + extension : ''

    return [
      this.source + '/' + this.name + extension,
      this.source + '/' + sourceName + extension,
      '.'
    ].filter(path => fs.existsSync(path)).shift()
  }

  /**
   * Gets a stash by checking ancestors.
   */
  getStash(){
    return this.stash
      ? this.stash
      : typeof this.parent == 'Service'
        ? this.parent.getStash()
        : false
  }
}


module.exports = Service