import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ColorSelectPage } from './color-select.page';

describe('ColorSelectPage', () => {
  let component: ColorSelectPage;
  let fixture: ComponentFixture<ColorSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColorSelectPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
