import { TestBed, inject } from '@angular/core/testing';

import { NavChangeService } from './nav-change.service';

describe('NavChangeService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavChangeService]
    });
  });

  it('should be created', inject([NavChangeService], (service: NavChangeService) => {
    expect(service).toBeTruthy();
  }));
});
