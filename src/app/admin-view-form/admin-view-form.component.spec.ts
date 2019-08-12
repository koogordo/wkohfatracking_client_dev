import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewFormComponent } from './admin-view-form.component';

describe('AdminViewFormComponent', () => {
  let component: AdminViewFormComponent;
  let fixture: ComponentFixture<AdminViewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminViewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
