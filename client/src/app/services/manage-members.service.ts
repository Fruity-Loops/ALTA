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
  returnFields = ["id", "user_name", "first_name", "last_name", "email", "organization", "role", "location", "is_active"];
  

  constructor(private http: HttpClient, // We inject the http client in the constructor to do our REST operations
              private authService: AuthService) {}

  getAllClients(): Observable<any> {
    let excluder = [JSON.stringify({"id": localStorage.getItem('id')})];
    if (this.authService.getOrgMode().getValue()) {
      let filter = [JSON.stringify({"organization": localStorage.getItem('organization_id')})];
      return this.http.get(`${this.BASEURL}/user/`,
        {params: {organization: localStorage.getItem('organization_id'), fields_to_return: this.returnFields, fields_to_filter: filter, fields_to_exclude: excluder}});
    } else {
      let filter = [JSON.stringify({"role": "SA"})];
      return this.http.get<User[]>(`${this.BASEURL}/user/`, {params: {fields_to_return: this.returnFields, fields_to_filter: filter, fields_to_exclude: excluder}}).pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(`Error: ${err.status}: ${err.error}`);
          return EMPTY; // TODO: Implement proper error handling
        })
      );
    }

  }

  updateClientInfo(employee, id): Observable<any> {
    return this.http.patch(`${this.BASEURL}/user/${id}/`, {fields_to_save: employee});
  }

  updatePassword(password, id): Observable<any> {
    return this.http.patch(`${this.BASEURL}/user/${id}/`, {fields_to_save: password});
  }

  getEmployee(id): Observable<any> {
    return this.http.get(`${this.BASEURL}/user/${id}/`, {params: {fields_to_return: this.returnFields}});
  }
}
