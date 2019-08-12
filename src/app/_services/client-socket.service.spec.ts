import { TestBed } from '@angular/core/testing';

import { ClientSocketService } from './client-socket.service';

describe('ClientSocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ClientSocketService = TestBed.get(ClientSocketService);
    expect(service).toBeTruthy();
  });
});
