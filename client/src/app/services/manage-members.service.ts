import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
    return this.http.get<User[]>(`${this.BASEURL}/accessClients/`)
    .pipe(
      catchError((err: HttpErrorResponse) => {
        console.error(`Error: ${err.status}: ${err.error}`);
        return EMPTY; // TODO: Implement proper error handling
      })
    );
  }

  getSpecificClients(firstName): Observable<any>
  {
    return this.http.post(`${this.BASEURL}/searchClients/`, firstName);
  }

  modifyClientInfo(category, field, id): Observable<any>
  {
    const body = {[category]: field};
    return this.http.patch(`${this.BASEURL}/accessClients/${id}/`, body);
  }
}
