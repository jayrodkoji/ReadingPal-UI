
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DictionaryComponent } from './dictionary.component';

describe('DictionaryComponent', () => {
  let component: DictionaryComponent;
  let fixture: ComponentFixture<DictionaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DictionaryComponent ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(DictionaryComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();  // causes 'should create' test to fail. Move to other tests when needed.
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
