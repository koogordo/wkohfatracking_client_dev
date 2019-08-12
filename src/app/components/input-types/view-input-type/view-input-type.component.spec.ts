import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewInputTypeComponent } from './view-input-type.component';

describe('ViewInputTypeComponent', () => {
  let component: ViewInputTypeComponent;
  let fixture: ComponentFixture<ViewInputTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewInputTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewInputTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
