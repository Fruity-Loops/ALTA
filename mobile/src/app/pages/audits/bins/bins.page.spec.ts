import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { BinsPage } from './bins.page';

describe('BinsPage', () => {
  let component: BinsPage;
  let fixture: ComponentFixture<BinsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BinsPage ],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BinsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
