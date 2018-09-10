import { TestBed, inject } from '@angular/core/testing';

import { KeepingService } from './keeping.service';

describe('KeepingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [KeepingService]
    });
  });

  it('should be created', inject([KeepingService], (service: KeepingService) => {
    expect(service).toBeTruthy();
  }));
});
