import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { HttpClientModule } from '@angular/common/http'
import { ReactiveFormsModule } from '@angular/forms'

import { MatTabsModule } from '@angular/material/tabs'
import { MatExpansionModule } from '@angular/material/expansion'
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { UserService } from './user.service'

import { AppComponent } from './app.component'
import { UsersComponent } from './users/users.component'

import { Iterable } from './iterable.pipe';

import { SchemaFormComponent } from './schema-form/schema-form.component'
import { SchemaFormElementComponent } from './schema-form-element/schema-form-element.component'
import { SchemaFormGroupComponent } from './schema-form-group/schema-form-group.component'
import { SchemaFormActionComponent } from './schema-form-action/schema-form-action.component'


@NgModule({

  declarations: [

    AppComponent,
    UsersComponent,

    Iterable,

    SchemaFormComponent,
    SchemaFormElementComponent,
    SchemaFormGroupComponent,
    SchemaFormActionComponent

  ],

  imports: [

    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,

    MatTabsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule

  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})

export class AppModule { }