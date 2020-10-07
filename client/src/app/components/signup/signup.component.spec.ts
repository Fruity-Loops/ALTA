import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignupComponent } from './signup.component';
import { FormBuilder } from '@angular/forms';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let authService: AuthService;
  let tokenService: TokenService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        FormBuilder,
        {
          provide: AuthService,
        },
        {
          provide: TokenService,
        },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    tokenService = TestBed.inject(TokenService);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create signup component', () => {
    expect(component).toBeTruthy();
  });
});
