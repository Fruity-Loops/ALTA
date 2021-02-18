import {TestBed} from '@angular/core/testing';
import {TokenService} from '../services/authentication/token.service';
import {RouterTestingModule} from '@angular/router/testing';

import {AuthGuard} from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [{provide: TokenService}],
    });
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
