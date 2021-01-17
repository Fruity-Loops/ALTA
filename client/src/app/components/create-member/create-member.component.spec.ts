import {ComponentFixture, TestBed} from '@angular/core/testing';
import {AuthService} from 'src/app/services/auth.service';
import {TokenService} from 'src/app/services/token.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {CreateMemberComponent} from './create-member.component';
import {FormBuilder} from '@angular/forms';
import {ManageOrganizationsService} from 'src/app/services/manage-organizations.service';

describe('SignupComponent', () => {
  let component: CreateMemberComponent;
  let fixture: ComponentFixture<CreateMemberComponent>;
  //@ts-ignore
  let authService: AuthService;
  //@ts-ignore
  let tokenService: TokenService;
  //@ts-ignore
  let manageOrganizationsService: ManageOrganizationsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateMemberComponent],
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
    fixture = TestBed.createComponent(CreateMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create create-member component', () => {
    expect(component).toBeTruthy();
  });
});
