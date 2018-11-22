import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { FormsModule } from '@angular/forms'

import {
  MatButtonModule,
  MatCardModule ,
  MatDialogModule,
  MatExpansionModule,
  MatIconModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material'

import { AppComponent } from './app.component'
import { LoginComponent } from './components/login/login.component'
import { UserComponent } from './components/user/user.component'

import { SessionInterceptor } from './interceptors/session.interceptor';


@NgModule(
  {
    declarations: [
      AppComponent,
      LoginComponent,
      UserComponent
    ],

    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      FormsModule,
      HttpClientModule,

      MatButtonModule,
      MatCardModule ,
      MatDialogModule,
      MatExpansionModule,
      MatIconModule,
      MatInputModule,
      MatProgressSpinnerModule,
      MatSelectModule,
      MatTableModule,
      MatTabsModule,
      MatToolbarModule,
    ],

    entryComponents: [ LoginComponent ],

    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: SessionInterceptor, multi: true }
    ],

    bootstrap: [AppComponent]
  }
)


export class AppModule { }
