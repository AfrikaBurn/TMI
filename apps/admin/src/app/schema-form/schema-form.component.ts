import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-schema-form',
  templateUrl: './schema-form.component.html',
  styleUrls: ['./schema-form.component.css']
})

export class SchemaFormComponent implements OnInit {

	@Input() schema = {}
	@Input() model = {}
	@Input() key = {}
	@Input() parent: FormGroup

	formGroup: FormGroup

  constructor() { }

  ngOnInit() {
  	this.formGroup = new FormGroup({})
  	if (this.parent) this.formGroup.setParent(this.parent)
  }

}
