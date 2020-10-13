import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { User } from '../models/user.model';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
    providedIn: 'root',
  })
  export class DashboardService {
    constructor(private http: HttpClient) {} // We inject the http client in the constructor to do our REST operations

    getAllClients(): Observable<any> {
      return this.http.get<User[]>(`${BASEURL}/getAllClients/`);
  }
}
