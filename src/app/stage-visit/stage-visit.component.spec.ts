import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StageVisitComponent } from './stage-visit.component';

describe('StageVisitComponent', () => {
  let component: StageVisitComponent;
  let fixture: ComponentFixture<StageVisitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StageVisitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StageVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
