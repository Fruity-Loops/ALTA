import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { NavigationPage } from './navigation.page';

describe('Navigation', () => {
  let component: NavigationPage;
  let fixture: ComponentFixture<NavigationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NavigationPage],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavigationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
