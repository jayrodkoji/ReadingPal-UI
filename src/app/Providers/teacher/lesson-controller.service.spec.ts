import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { LessonControllerService } from './lesson-controller.service';

describe('LessonControllerService', () => {
  let service: LessonControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, HttpClientTestingModule]
    });
    service = TestBed.inject(LessonControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
