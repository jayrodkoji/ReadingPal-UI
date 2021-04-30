import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BrowseLessonsPage } from './browse-lessons.page';

describe('BrowseLessonsPage', () => {
  let component: BrowseLessonsPage;
  let fixture: ComponentFixture<BrowseLessonsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseLessonsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BrowseLessonsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
