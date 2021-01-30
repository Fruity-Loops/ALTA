// Managing tokens in the frontend using cookies
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private cookieService: CookieService) {
  }

  // We set the token when we signup or login
  SetToken(token: string): void {
    this.cookieService.set('token', token);
  }

  // We get the token when we successfully signup or login
  GetToken(): string {
    return this.cookieService.get('token');
  }

  // We delete the token when the user logout
  DeleteToken(): void {
    this.cookieService.delete('token');
  }
}
