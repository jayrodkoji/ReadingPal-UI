import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { GetBooksService } from './get-books.service';

describe('GetBooksService', () => {
  let service: GetBooksService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(GetBooksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
