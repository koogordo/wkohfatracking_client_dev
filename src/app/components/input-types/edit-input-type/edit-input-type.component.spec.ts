import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInputTypeComponent } from './edit-input-type.component';

describe('EditInputTypeComponent', () => {
  let component: EditInputTypeComponent;
  let fixture: ComponentFixture<EditInputTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInputTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInputTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
