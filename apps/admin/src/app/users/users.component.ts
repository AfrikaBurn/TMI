import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { UserService } from '../user.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})


export class UsersComponent implements OnInit {


  // ----- Properties


  @Input() config = {}

  schema: any
  users: any
  status = 'loading'
  states = {
    loading: {
      icon: 'update',
      message: 'Loading...',
    },
    error: {
      icon: 'error',
      message: 'User service unavailable...',
    }
  }
  tableData = {userId: 'ID', username: 'Username', email: 'Email address'}

  // ----- Construction

  constructor(private userService: UserService, public snackBar: MatSnackBar) {
  	this.userService = userService
  }


  // ----- Event handling


  /**
   * Initialise.
   */
  ngOnInit() {
    this.fetch()
  }

  /**
   * React to button click on the user form.
   * @param {[type]} action [description]
   */
  onAction(event){

    console.log(event)

    if (event.verb == 'create'){
      this.userService.postUser(this.config, event.data).subscribe(
        data => {
          event.form.reset()
          this.snackBar.open('User created', 'Ok', {
              duration: 2000,
            }
          );
          this.fetchUsers()
        },
        error => { 
          this.snackBar.open('User could not be created because the service is unavailable!', 'Ok', {
              duration: 2000,
            }
          );
        }
      )
    }
  }


  // ----- Utility


  /**
   * Fetches data and metadata.
   */
  fetch(){
    this.fetchSchema()
    this.fetchUsers()
  }

  /**
   * Fetches user schema from the backend.
   */
  fetchSchema(){
    this.userService
      .getSchema(this.config)
      .subscribe(
        data => {
          this.schema = data
          this.status = 'ok'
        },
        error => {
          this.schema = null;
          this.status = 'error'
          setTimeout(() => this.fetchSchema(), 5000)
          console.log(error);
        }
      )    
  }

  /**
   * Fetches user collection from the back end
   */
  fetchUsers(){
    this.userService
      .getUsers(this.config)
      .subscribe(
        data => {
          this.users = data; 
          this.status = 'ok'
          console.log(this.users)
        },
        error => {
          this.users = null; 
          this.status = 'error'
          setTimeout(() => this.fetchUsers(), 5000)
          console.log(error);
        }
      )
  }
}
