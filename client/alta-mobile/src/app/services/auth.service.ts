import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'

const BASEURL = env.api_root;
const { Storage } = Plugins;
const ACCESS_TOKEN = 'token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null)
  token = '';

  constructor(private http: HttpClient) {
    this.verifyAccessToken();
  }

  async verifyAccessToken() {
    const token = await Storage.get({key: ACCESS_TOKEN});
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    }
    else {
      this.isAuthenticated.next(false);
    }
  }
  
  setAccessToken(token): Promise<void> {
    return Storage.set({key: ACCESS_TOKEN, value:token})
  }
  
  removeAccessToken(): Promise<void> {
    return Storage.remove({key: ACCESS_TOKEN})
  }
  
  login(body): Observable<any> {
    return this.http.post(`${BASEURL}/login-mobile/`, body).pipe(
      map((data: any) => data.token),
      switchMap(token => {
        return from(this.setAccessToken(token))
      }),
      tap(_ =>{
        this.isAuthenticated.next(true);
      })
    )
  };

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return this.removeAccessToken();
  }
}
