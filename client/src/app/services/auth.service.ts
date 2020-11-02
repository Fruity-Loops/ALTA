import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {} // We inject the http client in the constructor to do our REST operations

  register(body): Observable<any> {
    return this.http.post(`${BASEURL}/user/`, body);
  }

  openRegister(body): Observable<any> {
    return this.http.post(`${BASEURL}/open-registration/`, body);
  }

  login(body): Observable<any> {
    return this.http.post(`${BASEURL}/login/`, body);
  }
}
