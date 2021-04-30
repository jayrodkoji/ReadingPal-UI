import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LessonCreatorService } from './lesson-creator.service';

describe('LessonCreatorService', () => {
  let service: LessonCreatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LessonCreatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
