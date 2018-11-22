import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable(
  {
    providedIn: 'root'
  }
)

export class ConfigService {

  config = false

  constructor(private http: HttpClient) {}

  getConfig(callback){
    if (!this.config) {
      this.http.get('assets/config.json').subscribe(
        (data: any) => {
          this.config = data
          callback(this.config)
        }
      )
    } else callback(this.config)
  }
}
