import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http'

const
  JSON_HEADER = new HttpHeaders({'Content-Type':  'application/json'}),
  SCHEMA_HEADER = new HttpHeaders({'Content-Type':  'application/json;schema'}),
  POSITION_HEADER = new HttpHeaders({'Content-Type':  'application/json;position'})


@Injectable(
  {
    providedIn: 'root'
  }
)


export class UserService {

  constructor(private http: HttpClient) { }

  login(config, username, password, callback){
    this.http.post(
      config.core.concat('/user/login'),
      {
        username: username,
        password: password
      },
      {
        headers: JSON_HEADER,
        withCredentials: true
      }
    ).subscribe(
      (data) => callback(data),
      (error) => {
        console.log(error)
        callback(false)
      }
    )
  }

  connected(config, callback){
    this.http.get(
      config.core.concat('/user'),
      {
        headers: SCHEMA_HEADER,
        withCredentials: true
      }
    ).subscribe(
      (data: any) => callback(true),
      (error) => {
        console.log(error)
        callback(false)
      }
    )
  }

  schema(config, callback){
    this.http.get(
      config.core.concat('/user'),
      {
        headers: SCHEMA_HEADER,
        withCredentials: true
      }
    ).subscribe(
      (data: any) => callback(data.schema),
      (error) => {
        console.log(error)
        callback(false)
      }
    )
  }

  list(config, callback, header = JSON_HEADER){
    this.http.get(
      config.core.concat('/user'),
      {
        headers: header,
        withCredentials: true
      }
    ).subscribe(
      (data: any) => callback(
        header == JSON_HEADER
          ? data.entities
          : data.position
        ),
      (error) => {
        console.log(error)
        callback(false)
      }
    )
  }

  position(config, callback){
    this.list(
      config,
      callback,
      POSITION_HEADER
    )
  }
}
