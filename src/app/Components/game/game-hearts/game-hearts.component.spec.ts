import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { GameHeartsComponent } from './game-hearts.component';

describe('GameHeartsComponent', () => {
  let component: GameHeartsComponent;
  let fixture: ComponentFixture<GameHeartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameHeartsComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(GameHeartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
