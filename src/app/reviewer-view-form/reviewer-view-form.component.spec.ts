import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewerViewFormComponent } from './reviewer-view-form.component';

describe('ReviewerViewFormComponent', () => {
  let component: ReviewerViewFormComponent;
  let fixture: ComponentFixture<ReviewerViewFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewerViewFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewerViewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
