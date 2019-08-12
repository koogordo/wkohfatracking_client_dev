import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OsViewFormComponent } from './os-view-form.component';

describe('OsViewFormComponent', () => {
  let component: OsViewFormComponent;
  let fixture: ComponentFixture<OsViewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OsViewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OsViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
