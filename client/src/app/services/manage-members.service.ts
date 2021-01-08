import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../models/user.model';
import {AuthService} from './auth.service';

interface Body {
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})
export class ManageMembersService {
  // Connection with the backend
  BASEURL = env.api_root;

  constructor(private http: HttpClient, // We inject the http client in the constructor to do our REST operations
              private authService: AuthService) {}

  getAllClients(): Observable<any> {
    if (this.authService.getOrgMode().getValue()) {
      return this.http.get(`${this.BASEURL}/user/`,
        {params: {organization: localStorage.getItem('organization_id')}});
    } else {
      return this.http.get<User[]>(`${this.BASEURL}/accessClients/`).pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(`Error: ${err.status}: ${err.error}`);
          return EMPTY; // TODO: Implement proper error handling
        })
      );
    }

  }

  updateClientInfo(employee, id): Observable<any> {
    return this.http.patch(`${this.BASEURL}/user/${id}/`, employee);
  }

  updatePassword(password, id): Observable<any> {
    return this.http.patch(`${this.BASEURL}/user/${id}/`, password);
  }

  getEmployee(id): Observable<any> {
    return this.http.get(`${this.BASEURL}/user/${id}/`);
  }
}
