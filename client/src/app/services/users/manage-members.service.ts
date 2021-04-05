import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../../models/user.model';
import { AuthService, UserLocalStorage } from '../authentication/auth.service';


@Injectable({
  providedIn: 'root',
})
export class ManageMembersService {
  // Connection with the backend
  BASEURL = env.api_root;

  constructor(private http: HttpClient, // We inject the http client in the constructor to do our REST operations
              private authService: AuthService) {
  }

  getOrgId(): any {
    let orgId = this.authService.getLocalStorage(UserLocalStorage.OrgId);
    if (!orgId) {
      orgId = '';
    }
    return orgId ;
  }

  getAllClients(): Observable<any> {
    if (this.authService.getOrgMode().getValue()) {
      let params = new HttpParams();
      params = params.append('organization', this.getOrgId());
      params = params.append('no_pagination', 'True');
      return this.http.get(`${this.BASEURL}/user/`,
        {params});
    } else {
      return this.http.get<User[]>(`${this.BASEURL}/accessClients/`).pipe(
        catchError((err: HttpErrorResponse) => {
          console.error(`Error: ${err.status}: ${err.error}`);
          return EMPTY; // TODO: Implement proper error handling
        })
      );
    }
  }

  getPaginatedClients(params: HttpParams): Observable<any> {
    if (this.authService.getOrgMode().getValue()) {
      params = params.append('organization', this.getOrgId());
      return this.http.get(`${this.BASEURL}/user/`,
        { params });
    } else {
      return this.http.get<User[]>(`${this.BASEURL}/accessPagedClients/`
        , { params }).pipe(
          catchError((err: HttpErrorResponse) => {
            console.error(`Error: ${err.status}: ${err.error}`);
            return EMPTY; // TODO: Implement proper error handling
          })
        );
    }
  }

  updateClientInfo(employee: object, id: string): Observable<any> {
    return this.http.patch(`${this.BASEURL}/user/${id}/`, employee);
  }

  updatePassword(password: object, id: string): Observable<any> {
    return this.http.patch(`${this.BASEURL}/user/${id}/`, password);
  }

  getEmployee(id: string): Observable<any> {
    return this.http.get(`${this.BASEURL}/user/${id}/`);
  }
}
