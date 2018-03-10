import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
	@Input() formGroup: FormGroup

	control: FormControl

	title: String
	value: String
	widget: String

  constructor() {}

  ngOnInit() {}

  ngOnChanges(){

  	if (this.formGroup){
	  	this.control = new FormControl('', []);
	  	this.formGroup.removeControl(this.key)
	  	this.formGroup.addControl(this.key, this.control)  		
  	}

  	Object.assign(this,
			{
  			title: this.element.title,
  			value: '',
  			widget: this.element.widget || DEFAULT_WIDGETS[this.element.type]
			}
  	)
  }
}
