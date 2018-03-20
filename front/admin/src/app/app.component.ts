import { Component, OnInit } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'TMI Administration'
  config: {}

  constructor(private userService: UserService) {
  	this.userService = userService
    this.config = require('../../../../core/config.json')
  }

  ngOnInit() {}
}
