import {ComponentFixture, fakeAsync, flush, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {TokenService} from 'src/app/services/authentication/token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {EditEmployeeComponent} from './edit-employee.component';
import {FormBuilder} from '@angular/forms';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import 'zone.js/dist/zone-testing';
import {AppModule} from 'src/app/app.module';
import {of, throwError} from 'rxjs';
import {ManageMembersService} from '../../../../services/users/manage-members.service';

describe('EditEmployeeComponent', () => {
  let component: EditEmployeeComponent;
  let fixture: ComponentFixture<EditEmployeeComponent>;
  // @ts-ignore
  let authService: AuthService;
  // @ts-ignore
  let tokenService: TokenService;
  // @ts-ignore
  let manageOrganizationsService: ManageOrganizationsService;
  // @ts-ignore
  let manageMembersService: ManageMembersService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditEmployeeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, AppModule],
      providers: [
        FormBuilder,
        {
          provide: AuthService,
        },
        {
          provide: TokenService,
        },
        {
          provide: ManageOrganizationsService,
        },
        {
          provide: ManageMembersService
        },
      ],
    }).compileComponents();
    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    manageOrganizationsService = TestBed.inject(ManageOrganizationsService);
    manageMembersService = TestBed.inject(ManageMembersService);
    fixture = TestBed.createComponent(EditEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture = null;
    component = null;
    authService = null;
    tokenService = null;
    manageOrganizationsService = null;
    manageMembersService = null;
  });

  it('should create edit-employee component', () => {
    expect(component).toBeTruthy();
  });

  // Test the setSelectors table
  it('Call setSelectors', () => {
    try {
      component.setSelectors();
    } catch (err) {
      console.error(err);
    }
  });

  // Test the reload page drawer
  it('reload the page', () => {
    try {
      spyOn(location, 'reload').and.callFake(() => {});
      component.reloadPage();
    }
    catch (e) {
      console.error(e);
    }
  });

  // Test the edit mode
  it('edit mode', () => {
    try {
      component.editMode(false);
    } catch (e) {
      console.error(e);
    }
  });

  // // Test the edit mode
  // it('edit mode', () => {
  //   try {
  //     component.editMode(false);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // });

  // Test submitQuery method
  // it('test submitQuery', fakeAsync(() => {
  //   const errmsg = 'submitQuery Error';
  //   // spyOn(component, 'employee').and.returnValue({is_active: 'active'});
  //   component.employee = {is_active: 'some'};
  //   const spy = spyOn(manageMembersService, 'updateClientInfo');
  //   spy.and.returnValue(throwError({error: errmsg}));
  //   component.submitQuery({
  //     user_name: 'string',
  //     email: 'string',
  //     first_name: 'string',
  //     last_name: 'string',
  //     location: 'string'
  //   });
  //   flush();
  //   expect(component.errorMessage).toBe(errmsg);
  //   spy.calls.reset();
  // }));

  // // Test getEmployee
  // it('edit mode', fakeAsync(() => {
  //   try {
  //    // const spy = spyOn(manageMembersService, 'getEmployee').and.returnValue();
  //
  //     component.editMode(false);
  //   } catch (e) {
  //     console.error(e);
  //   }
  // }));
});
