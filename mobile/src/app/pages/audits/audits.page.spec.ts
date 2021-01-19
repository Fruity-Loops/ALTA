import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicModule } from '@ionic/angular';
import { AuditsPage } from './audits.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('AuditsPage', () => {
  let component: AuditsPage;
  let fixture: ComponentFixture<AuditsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditsPage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ],
      providers : [
        BarcodeScanner,
        AndroidPermissions,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
