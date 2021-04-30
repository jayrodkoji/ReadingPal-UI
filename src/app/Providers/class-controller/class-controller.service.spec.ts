import { TestBed } from '@angular/core/testing';

import { ClassControllerService } from './class-controller.service';

describe('ClassControllerService', () => {
  let service: ClassControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClassControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
