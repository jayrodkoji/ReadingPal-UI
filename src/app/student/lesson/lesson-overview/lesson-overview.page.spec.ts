import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { LessonOverviewPage } from './lesson-overview.page';

describe('LessonOverviewPage', () => {
  let component: LessonOverviewPage;
  let fixture: ComponentFixture<LessonOverviewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LessonOverviewPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LessonOverviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
