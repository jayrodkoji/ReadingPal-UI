import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { QuizControllerService } from './quiz-controller.service';

describe('QuizControllerService', () => {
  let service: QuizControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(QuizControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
