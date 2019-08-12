import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyArchiveViewComponent } from './family-archive-view.component';

describe('FamilyArchiveViewComponent', () => {
  let component: FamilyArchiveViewComponent;
  let fixture: ComponentFixture<FamilyArchiveViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyArchiveViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyArchiveViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
