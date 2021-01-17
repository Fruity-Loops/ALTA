import {ComponentFixture, TestBed} from '@angular/core/testing';
import {TokenService} from 'src/app/services/token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {HomeComponent} from './home.component';
import {SidenavService} from 'src/app/services/sidenav.service';
import {MatSidenavModule} from '@angular/material/sidenav';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  //@ts-ignore
  let tokenService: TokenService;
  let sidenavService: SidenavService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSidenavModule,
        BrowserAnimationsModule],
      providers: [
        {
          provide: TokenService,
        }, SidenavService,
      ],
    }).compileComponents();

    tokenService = TestBed.inject(TokenService);
    sidenavService = TestBed.inject(SidenavService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sidenav service should toggle the drawer', () => {
    sidenavService.setSidenav(component.sidenav);
    // Side Nav drawer should start open
    expect(component.sidenav.opened).toBeTrue();

    // Side Nav drawer should close after toggle
    sidenavService.toggle();
    fixture.detectChanges();
    expect(component.sidenav.opened).toBeFalse();

    // Side Nav drawer should be open again
    sidenavService.toggle();
    fixture.detectChanges();
    expect(component.sidenav.opened).toBeTrue();

    // Test closing the drawer
    sidenavService.close();
    fixture.detectChanges();
    expect(component.sidenav.opened).toBeFalse();

    // Test opening the drawer
    sidenavService.open();
    fixture.detectChanges();
    expect(component.sidenav.opened).toBeTrue();

  });
});
