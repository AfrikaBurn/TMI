import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'TMI Administration'

  ngOnInit() {
  	var config = require('../../../../core/config.json')
  	this.title = config.name + ' administration'
  } 
}
