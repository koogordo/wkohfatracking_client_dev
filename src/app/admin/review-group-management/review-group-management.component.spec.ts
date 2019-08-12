import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewGroupManagementComponent } from './review-group-management.component';

describe('ReviewGroupManagementComponent', () => {
  let component: ReviewGroupManagementComponent;
  let fixture: ComponentFixture<ReviewGroupManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewGroupManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewGroupManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
