import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { SidenavPage } from './sidenav.page';

describe('SidenavPage', () => {
  let component: SidenavPage;
  let fixture: ComponentFixture<SidenavPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(SidenavPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
