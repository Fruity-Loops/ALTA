import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { IonicModule } from '@ionic/angular';
import { ItemsPage } from './items.page';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

describe('ItemsPage', () => {
  let component: ItemsPage;
  let fixture: ComponentFixture<ItemsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemsPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
        BarcodeScanner,
        AndroidPermissions,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
