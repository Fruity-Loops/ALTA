import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

interface Body {
  [key: string]: any;
}

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

  getSpecificClients(name): Observable<any>
  {
    return this.http.post(`${this.BASEURL}/getSomeClients/`, JSON.stringify(name));
  }

  modifyClientInfo(category, field, id): Observable<any>
  {
    const sendMe: Body = {};
    sendMe.category = category;
    sendMe.field = field;
    sendMe.id = id;
    return this.http.post(`${this.BASEURL}/modifyClient/`, JSON.stringify(sendMe));
  }
}
