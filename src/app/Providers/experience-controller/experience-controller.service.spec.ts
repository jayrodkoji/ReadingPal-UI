import { TestBed } from '@angular/core/testing';

import { ExperienceControllerService } from './experience-controller.service';

describe('ExperienceControllerService', () => {
  let service: ExperienceControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExperienceControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
