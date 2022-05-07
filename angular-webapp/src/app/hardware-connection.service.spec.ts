import { TestBed } from '@angular/core/testing';

import { HardwareConnectionService } from './hardware-connection.service';

describe('HardwareConnectionService', () => {
  let service: HardwareConnectionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HardwareConnectionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
