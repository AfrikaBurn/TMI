import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) {}

  getSchema(config: Object): Observable<Object> {

  	var
  		url = 'http://localhost:' + config['port'] + '/user',
  		headers = {
    		headers: new HttpHeaders({'Content-Type': 'application/json;schema'})
    	}

    return this.http.get(url, headers)
	}

  getUsers(config: Object): Observable<Object> {

  	var
  		url = 'http://localhost:' + config['port'] + '/user',
  		headers = {
    		headers: new HttpHeaders({'Content-Type': 'application/json'})
    	}

    return this.http.get(url, headers)
	}

}