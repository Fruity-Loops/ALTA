import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map,  debounceTime } from 'rxjs/operators';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private user_id = new BehaviorSubject('');
  private username = new BehaviorSubject('');
  private role = new BehaviorSubject('');
  private organization_id = new BehaviorSubject('');
  private organization = new BehaviorSubject('');

  //Access Observables through mapped data
  sharedUser = combineLatest(this.user_id.asObservable(),
                             this.username.asObservable(),
                             this.role.asObservable(),
                             this.organization_id.asObservable(),
                             this.organization.asObservable())
                             .pipe(map(([user_id, username, role, org_id, org]) => {
                                return {
                                  user_id: this.user_id.value,
                                  username: this.username.value,
                                  role: this.role.value,
                                  org_id: this.organization_id.value,
                                  org: this.organization.value
                                }
                             }), debounceTime(0));

  constructor(private http: HttpClient) { // We inject the http client in the constructor to do our REST operations

    this.getCurrentUser(localStorage.getItem('id'))
      .subscribe((data) => {
        this.user_id.next(data.user_id);
        this.username.next(data.user_name);
        this.role.next(data.role);
        this.organization_id.next(data.organization_id);
        this.organization.next(data.organization_name);
      });
  }

  register(body): Observable<any> {
    return this.http.post(`${BASEURL}/user/`, body);
  }

  openRegister(body): Observable<any> {
    return this.http.post(`${BASEURL}/open-registration/`, body);
  }

  login(body): Observable<any> {
    return this.http.post(`${BASEURL}/login/`, body);
  }

  getCurrentUser(id): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}/`);
  }

  private setNext(nextUser_Id: any,
          nextUser: any,
          nextRole: any,
          nextOrg_Id: any,
          nextOrg: any): void {
    this.user_id.next(nextUser_Id);
    this.username.next(nextUser);
    this.role.next(nextRole);
    this.organization_id.next(nextOrg_Id);
    this.organization.next(nextOrg);

    localStorage.setItem('id', nextUser_Id);
  }

  setLogin(loggedInUser_Id: any,
           loggedInUser: any,
           loggedInRole: any,
           loggedInOrg_Id: any,
           loggedInOrg: any): void {
     this.setNext(loggedInUser_Id, loggedInUser, loggedInRole, loggedInOrg_Id, loggedInOrg);
  }

  setLogOut(): void {
    this.setNext('', '', '', '', '');
  }
}
