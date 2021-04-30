import { TestBed } from '@angular/core/testing';

import { CompletedLessonService } from './completed-lesson.service';

describe('CompletedLessonService', () => {
  let service: CompletedLessonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompletedLessonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
