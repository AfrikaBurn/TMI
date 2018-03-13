import { Component, Input, Output, EventEmitter, Host, ViewChild, QueryList } from '@angular/core';
import { SchemaFormComponent } from '../schema-form/schema-form.component'

@Component({
  selector: 'app-schema-form-action',
  templateUrl: './schema-form-action.component.html',
  styleUrls: ['./schema-form-action.component.scss']
})

export class SchemaFormActionComponent {

  @Input() verb: String
  @Input() primary: String
  @Input() secondary: String
  @Input() validate: String
  @Input() pristene: String
  @Input() clear: String

  form : SchemaFormComponent

  constructor(@Host() form: SchemaFormComponent) { 
    this.form = form
  }

  /**
   * Computes the button color attribute
   * @return String [primary|secondary]
   */
  getColor(){
    switch(true){
      case this.primary != undefined: return 'primary'
      case this.secondary != undefined: return 'secondary'
    }
  }

  /**
   * Computes the disabled state of the button
   */
  getDisabled(){

    var
      toValidate = this.validate != undefined,
      bePristine = this.pristene != undefined,
      valid = this.form.formGroup.valid,
      pristene = this.form.formGroup.pristine

    switch (true) {
      case toValidate: return pristene || !valid
      case bePristine: return pristene
      default: return false
    }
  }

  /**
   * Handles the click event on the button
   */
  onClick(){

    if (this.clear != undefined) this.form.reset()

    this.form.action.emit(
      {
        verb: this.verb,
        data: this.form.getValue()['data'],
        form: this.form
      }
    )
  }
}
