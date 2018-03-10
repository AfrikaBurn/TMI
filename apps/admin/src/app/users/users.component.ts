import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

	@Input() config = {}
  schema = null
  schemaLoading = true
  schemaError = false
  users = {}
  usersLoading = true
  usersError = false

  constructor(private userService: UserService) {
  	this.userService = userService
  }

  ngOnInit() {
  	this.userService
      .getSchema(this.config)
      .subscribe(
        data => {this.schema = data; this.schemaError = false },
        error => {this.schema = null; console.log(error); this.schemaError = true}
      )
    this.userService
      .getUsers(this.config)
      .subscribe(
        data => {this.users = data; this.usersError = false },
        error => {this.users = null; console.log(error); this.usersError = true}
      )
  }

  onCreateUser(){
    
  }

}
