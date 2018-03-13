import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  /**
   * Retrieves user schema from storage
   * @param  {Object}             config Core service configuration
   * @return {Observable<Object>}        Observable object to fulfil retrieval
   */
  getSchema(config: Object): Observable<Object> {

  	var
  		url = 'http://localhost:' + config['port'] + '/user',
  		headers = {
    		headers: new HttpHeaders({'Content-Type': 'application/json;schema'})
    	}

    return this.http.get(url, headers)
	}

  /**
   * Gets a list users from the backend.
   * @param  {Object}             config Core service configuration.
   * @return {Observable<Object>}        Observable object to fulfil retrieval.
   */
  getUsers(config: Object): Observable<Object> {

  	var
  		url = 'http://localhost:' + config['port'] + '/user',
  		headers = {
    		headers: new HttpHeaders({'Content-Type': 'application/json'})
    	}

    return this.http.get(url, headers)
	}

  /**
   * Posts a user to the backend.
   * @param  {Object}             config Core service configuration.
   * @param {Object} user   [description]
   * @return {Observable<Object>}        Observable object to fulfil postage.
   */
  postUser(config: Object, user: Object){

    var
      url = 'http://localhost:' + config['port'] + '/user',
      headers = {
        headers: new HttpHeaders({'Content-Type': 'application/json'})
      }

    return this.http.post(url, user, headers)
  }
}