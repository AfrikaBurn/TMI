/**
 * @file Service.js
 * A basic service for a single path with the means to map, attach and detach
 * HTTP method calls to handler functions by the same name.
 */

"use strict"


const

  bodyParser = require('body-parser')


class Service {

  /**
   * Creates a new Service
   * @param  {object} minion Minion that contains this service minion object.
   */
  constructor(minion){
    this.minion = minion
    this.path = this.minion.getConfig().path || this.minion.getConfig().schema
    this.attach()
  }

  /**
   * Declare methods to respond to and middleware to apply to each
   * @return object middleware mapping keyed by method
   */
  methods(){
    return {}
  }


  // ----- Method utilities -----


  /**
   * Attach request method responders
   */
  attach(){

    var
      methods = this.methods(),
      router = this.minion.minimi.router

    for (let method in methods){
      if (this[method]){

        for (let middleware in methods[method]){
          this.minion.minimi.router[method](
            '/' + this.path,
            methods[method][middleware]
          )
        }

        this.minion.minimi.router[method](
          '/' + this.path,
          (request, response) => {
            var result = this[method](request, response)
            if (result){
              response.send(result)
            }
          }
        )
      }
    }
  }

  /**
   * Releases all path handlers.
   */
  detach(){

    var
      path = '/' + this.path,
      routes = this.minion.minimi.router.stack,
      keys = Object.keys(routes).reverse()

    for(var i in keys){
      if(routes[keys[i]].route && routes[keys[i]].route.path == path){
        routes.splice(
          keys[i],
          1
        )
      }
    }
  }
}


Service.PARSE_BODY  = bodyParser.json()
Service.PARSE_QUERY = bodyParser.urlencoded({ extended: false })
Service.CONSOLE_LOG = function consoleLog(request, response, next) {
  console.log('Processing: ' + request.url)
  console.log('Accept: ' + request.header('Accept'))
  console.log('Content-Type: ' + request.header('Content-Type'))
  console.log('Query:', request.query)
  console.log('Body:', request.body ,'\n')
  next()
}


module.exports = Service