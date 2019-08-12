import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmittedDialogComponent } from './submitted-dialog.component';

describe('SubmittedDialogComponent', () => {
  let component: SubmittedDialogComponent;
  let fixture: ComponentFixture<SubmittedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmittedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmittedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
