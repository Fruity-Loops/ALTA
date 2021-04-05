import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/authentication/auth.service';
import {TokenService} from 'src/app/services/authentication/token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CreateEmployeeComponent} from './create-employee.component';
import {FormBuilder} from '@angular/forms';
import {ManageOrganizationsService} from 'src/app/services/organizations/manage-organizations.service';
import 'zone.js/dist/zone-testing';
import {throwError} from 'rxjs';

describe('SignupComponent', () => {
  let component: CreateEmployeeComponent;
  let fixture: ComponentFixture<CreateEmployeeComponent>;
  // @ts-ignore
  let authService: AuthService;
  // @ts-ignore
  let tokenService: TokenService;
  // @ts-ignore
  let manageOrganizationsService: ManageOrganizationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreateEmployeeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
    manageOrganizationsService = TestBed.inject(ManageOrganizationsService);
    
    fixture = TestBed.createComponent(CreateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create create-employee component', () => {
    expect(component).toBeTruthy();
  });

    // Test the submitForm()
  it('Call method', fakeAsync(() => {

    spyOn(authService, 'openRegister').and.returnValue(throwError({error: {email: 'nich', user_name: 'nok'}}));
    spyOn(tokenService, 'GetToken').and.returnValue('');

    component.submitForm();
    expect(component.errorMessage).toBe('A member with that employee ID already exists');
  }));
});
