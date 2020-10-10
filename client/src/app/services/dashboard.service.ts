import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
    providedIn: 'root',
  })
  export class DashboardService {
    options = {responseType: 'text' as const};

    constructor(private http: HttpClient) {} // We inject the http client in the constructor to do our REST operations

    getAllClients(): Observable<any> {
      return this.http.get(`${BASEURL}/getAllClients/`, this.options)
  }
}