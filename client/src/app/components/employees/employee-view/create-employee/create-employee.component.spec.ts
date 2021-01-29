import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/auth.service';
import {TokenService} from 'src/app/services/token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CreateEmployeeComponent} from './create-employee.component';
import {FormBuilder} from '@angular/forms';
import {ManageOrganizationsService} from 'src/app/services/manage-organizations.service';

describe('SignupComponent', () => {
  let component: CreateEmployeeComponent;
  let fixture: ComponentFixture<CreateEmployeeComponent>;
  // @ts-ignore
  let authService: AuthService;
  // @ts-ignore
  let tokenService: TokenService;
  // @ts-ignore
  let manageOrganizationsService: ManageOrganizationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create create-employee component', () => {
    expect(component).toBeTruthy();
  });
});
