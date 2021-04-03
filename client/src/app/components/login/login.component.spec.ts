import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/authentication/auth.service';
import { TokenService } from 'src/app/services/authentication/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder } from '@angular/forms';
import { LoginComponent } from './login.component';
import { ManageMembersService } from 'src/app/services/users/manage-members.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  // @ts-ignore
  let authService: AuthService;
  // @ts-ignore
  let tokenService: TokenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
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
          provide: ManageMembersService,
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create login component', () => {
    expect(component).toBeTruthy();
  });
});
