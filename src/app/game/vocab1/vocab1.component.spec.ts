import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Vocab1Component } from './vocab1.component';

describe('Vocab1Component', () => {
  let component: Vocab1Component;
  let fixture: ComponentFixture<Vocab1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Vocab1Component ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Vocab1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
