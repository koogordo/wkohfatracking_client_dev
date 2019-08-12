import { TestBed, inject } from '@angular/core/testing';

import { FormGroupService } from './form-group-service.service';

describe('FormGroupService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormGroupService]
    });
  });

  it('should be created', inject([FormGroupService], (service: FormGroupService) => {
    expect(service).toBeTruthy();
  }));
});
