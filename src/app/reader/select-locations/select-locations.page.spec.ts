import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SelectLocationsPage } from './select-locations.page';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {UrlSerializer} from '@angular/router';

describe('SelectLocationsPage', () => {
  let component: SelectLocationsPage;
  let fixture: ComponentFixture<SelectLocationsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectLocationsPage ],
      imports: [IonicModule.forRoot(), HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(SelectLocationsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
