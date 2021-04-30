import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BadgeControllerService } from './badge-controller.service';

describe('BadgeCreatorControllerService', () => {
  let service: BadgeControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(BadgeControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
