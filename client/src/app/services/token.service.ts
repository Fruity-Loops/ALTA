//Managing tokens in the frontend using cookies
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  constructor(private cookieService: CookieService) {}

  //we set the token when we signup or login
  SetToken(token) {
    this.cookieService.set('chat_token', token);
  }

  //we get the token when we successfully signup or login
  GetToken() {
    return this.cookieService.get('chat_token');
  }

  //We delete the token when the user logout
  DeleteToken() {
    this.cookieService.delete('chat_token');
  }
}
