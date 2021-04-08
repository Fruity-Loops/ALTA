import { TestBed } from '@angular/core/testing';
import { TokenService } from '../services/authentication/token.service';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { ManageMembersService } from '../services/users/manage-members.service';
import { AuthService } from '../services/authentication/auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: TokenService },
        { provide: ManageMembersService },
        { provide: AuthService },
      ],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
