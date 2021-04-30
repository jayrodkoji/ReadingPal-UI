import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ReaderControlsPage } from './reader-controls.page';

describe('ReaderControlsPage', () => {
  let component: ReaderControlsPage;
  let fixture: ComponentFixture<ReaderControlsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderControlsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderControlsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
