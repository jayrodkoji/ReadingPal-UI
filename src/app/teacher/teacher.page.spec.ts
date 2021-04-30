import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { TeacherPage } from './teacher.page';

describe('TeacherPage', () => {
  let component: TeacherPage;
  let fixture: ComponentFixture<TeacherPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeacherPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TeacherPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
