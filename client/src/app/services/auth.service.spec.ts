import { env } from 'src/environments/environment';
// Http testing module and mocking controller
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  const BASEURL = env.api_root;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule],
    });

    // Inject the http, test controller, and service-under-test
    // As they will be referenced by each test.
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpMock.verify();
  });

  /// AuthService method tests begin ///

  // Angular default test added when you generate a service using the CLI
  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  // Test registration
  describe('#registerSysAdmin()', () => {
    it('returned Observable should match the right data', () => {
      const mockSysAdmin = {
        user_name: 'angular',
        first_name: 'test',
        last_name: 'god',
        email: 'test@gmail.com',
        password: '12',
        role: 'SA',
        is_active: 'true',
      };

      // We run the registerSysAdmin function and we expect that the property name in the response that we
      // Will get when the request is carried (when the observable resolves) out is ‘angular’
      // (The same as in the mockSysAdmin).
      authService.register({}).subscribe((sysAdminData) => {
        expect(sysAdminData.user_name).toEqual('angular');
      });

      // We expect that we can call the endpoint defined as a param of expectOne, which is checking
      // That there is just one request.
      const req = httpMock.expectOne(`${BASEURL}/user/`);

      // We also check that the type of request is a POST.
      expect(req.request.method).toEqual('POST');

      // Then we ‘flush’ or respond with the mock data that we pass as a parameter,
      // And that causes the Observable to resolve and evaluate the expect on line 55.
      req.flush(mockSysAdmin);
    });
  });

  // Test login
  describe('#login()', () => {
    it('returned Observable should match the right data', () => {
      const mockSysAdmin2 = {
        user_name: 'angular',
        password: '12',
      };

      authService.login({}).subscribe((sysAdminData) => {
        expect(sysAdminData.user_name).toEqual('angular');
      });

      const req = httpMock.expectOne(`${BASEURL}/login/`);

      expect(req.request.method).toEqual('POST');

      req.flush(mockSysAdmin2);
    });
  });
});
