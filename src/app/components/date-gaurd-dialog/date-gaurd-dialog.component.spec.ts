import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateGaurdDialogComponent } from './date-gaurd-dialog.component';

describe('DateGaurdDialogComponent', () => {
  let component: DateGaurdDialogComponent;
  let fixture: ComponentFixture<DateGaurdDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DateGaurdDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateGaurdDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
