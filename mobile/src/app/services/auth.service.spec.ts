import { env } from 'src/environments/environment';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should signin and authenticate', () => {
    const user = {
      email: 'sk@test.com',
      password: '123456789',
    };
    service.login(user).subscribe(async () => {
      expect(service.isAuthenticated.value).toEqual(true);
    });

    const req = controller.expectOne(`${env.api_root}/login-mobile/`);
    expect(req.request.method).toEqual('POST');
    req.flush(user);
  });

});
