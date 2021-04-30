import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReadingBookSelectPopoverComponent } from './add-reading-book-select-popover.component';

describe('AddReadingBookSelectPopoverComponent', () => {
  let component: AddReadingBookSelectPopoverComponent;
  let fixture: ComponentFixture<AddReadingBookSelectPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReadingBookSelectPopoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReadingBookSelectPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
