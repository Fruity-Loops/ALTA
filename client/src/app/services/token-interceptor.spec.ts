import {env} from 'src/environments/environment';
// We want to test that an appropriate header configuration
// Is added to each http request before sending it to server
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {TokenInterceptor} from './token-interceptor';
import {AuthService} from './auth.service';
import {TestBed} from '@angular/core/testing';
import {HTTP_INTERCEPTORS} from '@angular/common/http';

describe('TokenInterceptor', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  const BASEURL = env.api_root;

  // BeforeEach function runs before every test
  // Allowing us to register a new TestBed module that registers both the
  // Service and the Interceptor.
  beforeEach(() => {
    TestBed.configureTestingModule({
      // Import the HttpClient mocking services
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: TokenInterceptor,
          multi: true,
        },
      ],
    });

    // Inject the http, test controller, and service-under-test
    // As they will be referenced by each test.
    // HttpTestingController helps us mocking and flushing http request
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    // We are calling verify() method after each test to make sure that theres
    // No unmatched outstanding request
    httpMock.verify();
  });

  it('should add content-type and Accept property in http header', () => {

    authService.login({}).subscribe((res) => {
      expect(res).toBeTruthy();
    });

    const httpReq = httpMock.expectOne(`${BASEURL}/login/`);

    // We can assert that the httpRequest’s request.headers object contains a header
    // With the names of ‘Accept’ and ‘Content-Type’. If this is the case then our interceptor has successfully added.
    expect(httpReq.request.headers.has('Content-Type')).toEqual(true);
    expect(httpReq.request.headers.has('Accept')).toEqual(true);

    // Now we need to check whether included ‘Accept’ and ‘Content-Type’ header contains the values we expect
    expect(httpReq.request.headers.get('Content-Type')).toBe(
      'application/json'
    );
    expect(httpReq.request.headers.get('Accept')).toBe('application/json');

    //  TODO: Should check out how to see if tokens are set
    // Expect(httpReq.request.headers.has('Authorization')).toEqual(true);
  });
});
