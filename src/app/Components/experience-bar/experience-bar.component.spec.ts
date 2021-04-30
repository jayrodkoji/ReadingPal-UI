import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import {ExperienceBarComponent, ExperienceLevel} from './experience-bar.component';

describe('ExperienceBarComponent', () => {
  let component: ExperienceBarComponent;
  let fixture: ComponentFixture<ExperienceBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExperienceBarComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ExperienceBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('experience threshold should start at 100', () => {
    expect(ExperienceLevel.calcRelativeThreshold(1) === 100).toBeTruthy();
  });
});
