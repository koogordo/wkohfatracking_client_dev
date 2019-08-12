import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactLogComponent } from './contact-log.component';

describe('ContactLogComponent', () => {
  let component: ContactLogComponent;
  let fixture: ComponentFixture<ContactLogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactLogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
