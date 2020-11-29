import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { Page1Page } from './page1.page';

describe('Page1Page', () => {
  let component: Page1Page;
  let fixture: ComponentFixture<Page1Page>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Page1Page ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(Page1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
