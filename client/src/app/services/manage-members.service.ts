import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ManageMembersService {
  // Connection with the backend
  BASEURL = 'http://localhost:8000';

  constructor(private http: HttpClient) { } // We inject the http client in the constructor to do our REST operations

  getAllClients(): Observable<any> {
    return this.http.get<User[]>(`${this.BASEURL}/getAllClients/`);
  }
}
