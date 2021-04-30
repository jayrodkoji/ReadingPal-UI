import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { ReaderPage } from './reader.page';

describe('ReaderPage', () => {
  let component: ReaderPage;
  let fixture: ComponentFixture<ReaderPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderPage ],
      imports: [IonicModule.forRoot(), , RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ReaderPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
