import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

//Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {} //we inject the http client in the constructor to do our REST operations

  registerUser(body): Observable<any> {
    //body consist of the complete object(username,email,password) because we use the reactive form module
    return this.http.post(`${BASEURL}/register`, body); //post method takes the route of the backend and the body
  }

  loginUser(body): Observable<any> {
    return this.http.post(`${BASEURL}/login/`, body);
  }
}
