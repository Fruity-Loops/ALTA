import {env} from 'src/environments/environment';
import {Injectable} from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
} from '@angular/common/http';
import {Observable, EMPTY} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {User} from '../models/user.model';
import {AuthService} from './auth.service';


// TODO: if dead code, remove
// interface Body {
//   [key: string]: any;
// }

@Injectable({
  providedIn: 'root',
})
export class ManageMembersService {
  // Connection with the backend
  BASEURL = env.api_root;

  constructor(private http: HttpClient, // We inject the http client in the constructor to do our REST operations
              private authService: AuthService) {
  }

  getOrgId(): any{
    let orgId = localStorage.getItem('organization_id');
    if (!orgId) {
      orgId = '';
    }
    return {organization: orgId};
  }

  getAllClients(): Observable<any> {
    if (this.authService.getOrgMode().getValue()) {
      return this.http.get(`${this.BASEURL}/user/`,
        {params: this.getOrgId()});
    } else {
      return this.http.get<User[]>(`${this.BASEURL}/accessClients/`).pipe(
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
