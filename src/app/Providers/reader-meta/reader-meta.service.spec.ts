import { TestBed } from '@angular/core/testing';

import { ReaderMetaService } from './reader-meta.service';

describe('ReaderMetaService', () => {
  let service: ReaderMetaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReaderMetaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
