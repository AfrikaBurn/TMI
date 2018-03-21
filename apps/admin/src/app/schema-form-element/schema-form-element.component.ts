import { Component, OnInit, Input } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'

const
	DEFAULT_WIDGETS = {
		"string": "textbox"
	}

@Component({
  selector: 'app-schema-form-element',
  templateUrl: './schema-form-element.component.html',
  styleUrls: ['./schema-form-element.component.css']
})

export class SchemaFormElementComponent implements OnInit {

	@Input() key: string
	@Input() element
  @Input() schema
  @Input() formGroup: FormGroup

	control: FormControl

  constructor() {}

  ngOnInit() {
  	this.formGroup.removeControl(this.key)
    this.control = new FormControl('', this.getValidators())
  	this.formGroup.addControl(this.key, this.control)  		
  }

  isVisible(){
    return this.element.widget 
      ? !this.element.widget.hidden 
      : true 
    }

  isValid(){
    return this.control.errors == null
  }

  getType(){
    return (
      this.element.widget 
        ? this.element.widget.type 
        : false
      ) 
      || DEFAULT_WIDGETS[this.element.type]
  }

  getValidators(){
    var
      validators = []

    if (this.schema.required && this.schema.required.indexOf(this.key) != -1) validators.push(
      Validators.required
    )

    return validators
  }
}
