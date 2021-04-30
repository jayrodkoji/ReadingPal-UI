import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AwardComponent } from './award.component';

describe('AwardComponent', () => {
  let component: AwardComponent;
  let fixture: ComponentFixture<AwardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AwardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
