import { Component, Inject, OnInit } from '@angular/core'
import { UserService } from '../../services/user.service'

import {
  MatDialogRef,
  MatInputModule,
  MAT_DIALOG_DATA
} from '@angular/material'


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent {

  message: String
  username: String
  password: String
  busy = false
  result = false
  attempt = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public config: any,
    public dialogRef: MatDialogRef<LoginComponent>,
    private userService: UserService
  ) {
    dialogRef.disableClose = true
  }

  onLoginClick(){

    var dialog = this

    this.busy = true
    this.userService.login(
      this.config,
      this.username,
      this.password,
      (result) => {
        if (result.code == 200) {
          dialog.busy = false
          dialog.dialogRef.close(result.user)
        } else {
          dialog.attempt++
          setTimeout(() => {
            dialog.busy = false
            dialog.message = result.error
          }, 1000 * dialog.attempt * dialog.attempt);
        }
      }
    )
  }
}
