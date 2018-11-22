import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { LoginComponent } from './components/login/login.component'
import { ConfigService } from './services/config.service';
import { UserService } from './services/user.service';


@Component(
  {
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
  }
)


export class AppComponent implements OnInit {

  user = false
  config = false
  connecting = false
  appName = ''

  constructor(
    public dialog: MatDialog,
    private configService: ConfigService,
    private userService: UserService
  ) {}

  connect(connected = false, timeout = 0){
    if (connected) {
      this.connecting = false
      this.ping(true)
      this.showLogin()
    } else {
      this.connecting = true
      this.user = null
      setTimeout(() => {
        this.userService.connected(
          this.config,
          (connected) => {
            this.connect(connected, 1000)
          }
        )
      }, timeout);
    }
  }

  ping(connected = true){
    if (connected){
      setTimeout(() => {
        this.userService.connected(
          this.config,
          (connected) => {
            this.ping(connected)
          }
        )
      }, 5000);
    } else {
      this.connect(false, 0)
    }
  }

  showLogin(username = '', password = ''): void {
    let dialogRef = this.dialog.open(
      LoginComponent,
      {
        data: this.config,
        width: "500px",
        height: "450px"
      }
    )
    dialogRef.afterClosed().subscribe((user) => this.user = user)
  }

  ngOnInit() {
    this.configService.getConfig(
      (config) => {
        this.config = config
        this.appName = config.name
        this.connect()
      }
    )
  }
}