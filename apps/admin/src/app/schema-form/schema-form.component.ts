import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

import { SchemaFormActionComponent } from '../schema-form-action/schema-form-action.component'


@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  styleUrls: ['./schema-form.component.css']
})


export class SchemaFormComponent implements OnInit {

	@Input() schema = {}
	@Input() model = {}
	@Input() class = {}
  @Input() validated = []

  @Output() action = new EventEmitter()

	formGroup: FormGroup

  /**
   * @inheritDoc
   */
  constructor() { }


  /**
   * @inheritDoc
   */
  ngOnInit() {
  	this.formGroup = new FormGroup({})
  }

  /**
   * Constructs a value object for the form.
   * @param {[type]} controls Optional control to compute.
   */
  getValue(controls?){

    controls = controls || this.formGroup.controls

    var value = {}

    for (let i in controls) {
      value[i] = controls[i] instanceof FormGroup
        ? this.getValue(controls[i].controls)
        : controls[i].value
    }

    return value
  }

  /**
   * Reset form controls
   * @param {[type]} controls Optional control to reset.
   */
  reset(controls?){

    controls = controls || this.formGroup.controls

    for (let i in controls) {
      if (controls[i] instanceof FormGroup){
        this.reset(controls[i].controls)
      } else {
        controls[i].reset()
      }
    }
  }
}
