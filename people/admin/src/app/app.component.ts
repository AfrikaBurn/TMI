import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'

import { LoginComponent } from './components/login/login.component'
import { ConfigService } from './services/config.service';


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
  appName = ''

  constructor(
    public dialog: MatDialog,
    private configService: ConfigService
  ) {}

  showLogin(username = '', password = ''): void {
    let dialogRef = this.dialog.open(
      LoginComponent,
      {
        data: this.config,
        width: "500px",
        height: "450px"
      }
    )
    dialogRef.afterClosed().subscribe(user => this.user = user)
  }

  ngOnInit() {
    this.configService.getConfig(
      (config) => {
        this.config = config
        this.appName = config.name
        this.showLogin()
      }
    )
  }
}