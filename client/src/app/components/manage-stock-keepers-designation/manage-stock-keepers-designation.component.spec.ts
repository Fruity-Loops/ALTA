import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ManageStockKeepersDesignationComponent } from './manage-stock-keepers-designation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';
import { ManageAuditsService } from 'src/app/services/audits/manage-audits.service';
import 'zone.js/dist/zone-testing';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { TokenService } from 'src/app/services/authentication/token.service';
import { throwError } from 'rxjs';
import { AppModule } from 'src/app/app.module';

describe('ManageStockeepersDesignationComponent', () => {
  let component: ManageStockKeepersDesignationComponent;
  let fixture: ComponentFixture<ManageStockKeepersDesignationComponent>;
  // @ts-ignore
  let service: ManageMembersService;
  // @ts-ignore
  let service2: ManageAuditsService;
  // @ts-ignore
  let authService: AuthService;
  // @ts-ignore
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageStockKeepersDesignationComponent],
      providers: [ManageMembersService,
        ManageAuditsService, {
          provide: AuthService,
        },
        {
          provide: TokenService,
        }, ],
      imports: [HttpClientTestingModule, RouterTestingModule, MatDialogModule, AppModule],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    service = TestBed.inject(ManageMembersService);
    service2 = TestBed.inject(ManageAuditsService);
    fixture = TestBed.createComponent(ManageStockKeepersDesignationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    authService = null;
    tokenService = null;
    service = null;
    service2 = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test the deleteAudit()
  it('Call deleteAudit', () => {
    try {
      component.deleteAudit();
      component.discardAudit();
    }
    catch (errorMessage) {
      console.error(errorMessage);
    }
  });

  // Test the dialog window
  it('Call the dialog object', () => {
    try {
      component.cancelDialog();
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the goback button
  it('Call the goback button function', fakeAsync(() => {

    spyOn(authService, 'openRegister').and.returnValue(throwError({ error: { email: 'nich', user_name: 'nok' } }));
    spyOn(tokenService, 'GetToken').and.returnValue('');
    component.goBackAssignSK();
    expect(component.errorMessage).toBe('');
    flush();
  }));

  // Test the autoAssign window
  it('Call the autoAssign object', () => {
    try {
      component.autoAssign();
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the identifyUser window
  it('Call the identifyUser object', () => {
    try {
      component.identifyUser(0);
    }
    catch (err) {
      console.error(err);
    }
  });

  // Test the submitPreAuditData window
  it('Call the submitPreAuditData object', () => {
    try {
      component.submitPreAuditData();
    }
    catch (err) {
      console.error(err);
    }
  });
});
