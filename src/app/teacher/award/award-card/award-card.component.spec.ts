import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AwardCardComponent } from './award-card.component';

describe('AwardCardComponent', () => {
  let component: AwardCardComponent;
  let fixture: ComponentFixture<AwardCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardCardComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AwardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
