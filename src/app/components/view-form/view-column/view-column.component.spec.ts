import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewColumnComponent } from './view-column.component';

describe('ViewColumnComponent', () => {
  let component: ViewColumnComponent;
  let fixture: ComponentFixture<ViewColumnComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewColumnComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
