import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRowComponent } from './view-row.component';

describe('ViewRowComponent', () => {
  let component: ViewRowComponent;
  let fixture: ComponentFixture<ViewRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
