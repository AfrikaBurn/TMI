import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { MatTabsModule } from '@angular/material/tabs'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'

import { UserService } from './user.service'

import { AppComponent } from './app.component'
import { UsersComponent } from './users/users.component'
import { SchemaFormComponent } from './schema-form/schema-form.component'
import { SchemaFormElementComponent } from './schema-form-element/schema-form-element.component'

import { Iterable } from './iterable.pipe'

@NgModule({

  declarations: [

    AppComponent,
    UsersComponent,

    SchemaFormComponent,
    SchemaFormElementComponent,

    Iterable

  ],

  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatTabsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule

  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }