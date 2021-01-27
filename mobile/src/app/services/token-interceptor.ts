import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { from } from 'rxjs';

const { Storage } = Plugins;
const ACCESS_TOKEN = 'token';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return from(this.handleIntercept(req, next));
  }

  async handleIntercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = await Storage.get({ key: ACCESS_TOKEN });

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: token && token.value ? `Token ${token.value}` : '',
    };

    const reqUpdated = req.clone({ setHeaders: headers });
    return next.handle(reqUpdated).toPromise();
  }
}
