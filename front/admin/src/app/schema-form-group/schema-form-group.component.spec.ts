import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemaFormGroupComponent } from './schema-form-group.component';

describe('SchemaFormGroupComponent', () => {
  let component: SchemaFormGroupComponent;
  let fixture: ComponentFixture<SchemaFormGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SchemaFormGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaFormGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
