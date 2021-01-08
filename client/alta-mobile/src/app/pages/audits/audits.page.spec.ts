import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { AuditsPage } from './audits.page';

describe('AuditsPage', () => {
  let component: AuditsPage;
  let fixture: ComponentFixture<AuditsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditsPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
