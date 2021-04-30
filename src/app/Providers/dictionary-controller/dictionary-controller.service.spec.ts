import { TestBed } from '@angular/core/testing';

import { DictionaryControllerService } from './dictionary-controller.service';

describe('DictionaryControllerService', () => {
  let service: DictionaryControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictionaryControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
