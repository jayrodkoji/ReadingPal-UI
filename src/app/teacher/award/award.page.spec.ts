import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AwardPage } from './award.page';

describe('AwardPage', () => {
  let component: AwardPage;
  let fixture: ComponentFixture<AwardPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AwardPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AwardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
