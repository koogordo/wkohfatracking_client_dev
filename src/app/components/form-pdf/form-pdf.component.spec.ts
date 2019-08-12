import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormPdfComponent } from './form-pdf.component';

describe('FormPdfComponent', () => {
  let component: FormPdfComponent;
  let fixture: ComponentFixture<FormPdfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormPdfComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
