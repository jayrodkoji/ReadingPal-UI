import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { VerifyDeleteLessonComponent } from './verify-delete-lesson.component';

describe('VerifyDeleteLessonComponent', () => {
  let component: VerifyDeleteLessonComponent;
  let fixture: ComponentFixture<VerifyDeleteLessonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifyDeleteLessonComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(VerifyDeleteLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
