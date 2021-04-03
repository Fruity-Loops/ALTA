/* https://angular.io/guide/http*/
/* With interception, you declare interceptors that inspect and transform HTTP requests
from your application to the server. The same interceptors may also inspect and transform the server's
responses on their way back to the application. Multiple interceptors form a forward-and-backward
chain of request/response handlers. Interceptors can perform a variety of implicit tasks,
from authentication to logging, in a routine, standard way, for every HTTP request/response.*/

import {Injectable} from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenService} from './token.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private tokenService: TokenService) {
  }

  /* The intercept method transforms a request into an Observable that eventually
  returns the HTTP response. In this sense, each interceptor is fully capable of
  handling the request entirely by itself */
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const headersConfig = {
      Accept: 'application/json',
      Authorization: '',
    };

    const token = this.tokenService.GetToken(); // Getting the token

    // If token is available in the cookie
    if (token) {
      // We set the Authorization header: token inside the object for every request
      headersConfig.Authorization = `Token ${token}`;
    }
    const reqUpdated = req.clone({setHeaders: headersConfig}); // We clone the request
    return next.handle(reqUpdated); // We handle the cloned request
  }
}
