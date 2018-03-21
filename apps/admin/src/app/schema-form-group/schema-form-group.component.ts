import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-schema-form-group',
  templateUrl: './schema-form-group.component.html',
  styleUrls: ['./schema-form-group.component.scss']
})

export class SchemaFormGroupComponent implements OnInit {

	@Input() schema = {}
	@Input() model = {}
	@Input() key = ''
	@Input() parentGroup: FormGroup

	formGroup: FormGroup

  constructor() { }

  ngOnInit() {
  	this.formGroup = new FormGroup({})
  	if (this.parentGroup) {
      this.formGroup.setParent(this.parentGroup)
      this.parentGroup.addControl(this.key, this.formGroup)
    }
  }

}
