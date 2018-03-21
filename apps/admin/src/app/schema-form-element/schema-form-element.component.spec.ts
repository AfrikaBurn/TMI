import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaFormElementComponent } from './schema-form-element.component';

describe('SchemaFormElementComponent', () => {
  let component: SchemaFormElementComponent;
  let fixture: ComponentFixture<SchemaFormElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaFormElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaFormElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
