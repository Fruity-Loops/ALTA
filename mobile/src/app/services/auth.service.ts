import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { setLoggedInUser, removeLoggedInUser, fetchAccessToken } from 'src/app/services/cache';

const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);

  constructor(private http: HttpClient) {
    this.verifyAccessToken();
  }

  async verifyAccessToken() {
    const token = await fetchAccessToken();
    if (token) {
      this.isAuthenticated.next(true);
    }
    else {
      this.isAuthenticated.next(false);
    }
  }

  login(body): Observable<any> {
    return this.http.post(`${BASEURL}/login-mobile/`, body)
      .pipe(
        switchMap((data: any) => {
          return from(setLoggedInUser(data));
        }),
        tap(_ => {
          this.isAuthenticated.next(true);
        })
      );
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return removeLoggedInUser();
  }
}
