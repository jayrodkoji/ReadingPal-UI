import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { StudentQuizCardPage } from './student-quiz-card.page';

describe('StudentQuizCardPage', () => {
  let component: StudentQuizCardPage;
  let fixture: ComponentFixture<StudentQuizCardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentQuizCardPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StudentQuizCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
