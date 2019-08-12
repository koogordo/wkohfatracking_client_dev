import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTabComponent } from './create-tab.component';

describe('CreateTabComponent', () => {
  let component: CreateTabComponent;
  let fixture: ComponentFixture<CreateTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
