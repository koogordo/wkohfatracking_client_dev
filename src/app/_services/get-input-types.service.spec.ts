import { TestBed, inject } from '@angular/core/testing';

import { GetInputTypesService } from './get-input-types.service';

describe('GetInputTypesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetInputTypesService]
    });
  });

  it('should be created', inject([GetInputTypesService], (service: GetInputTypesService) => {
    expect(service).toBeTruthy();
  }));
});

