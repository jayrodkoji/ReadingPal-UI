import { TestBed } from '@angular/core/testing';

import { VocabularyServicesService } from './vocabulary-services.service';

describe('VocabularyServicesService', () => {
  let service: VocabularyServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabularyServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
