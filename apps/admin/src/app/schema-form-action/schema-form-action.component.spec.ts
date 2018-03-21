import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaFormActionComponent } from './schema-form-action.component';

describe('SchemaFormActionComponent', () => {
  let component: SchemaFormActionComponent;
  let fixture: ComponentFixture<SchemaFormActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaFormActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaFormActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
