import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BadLoginPage } from './bad-login.page';

describe('BadLoginPage', () => {
  let component: BadLoginPage;
  let fixture: ComponentFixture<BadLoginPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BadLoginPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BadLoginPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
