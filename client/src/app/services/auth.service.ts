import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map,  debounceTime } from 'rxjs/operators';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userId = new BehaviorSubject('');
  private username = new BehaviorSubject('');
  private role = new BehaviorSubject('');
  private organizationId = new BehaviorSubject('');
  private organization = new BehaviorSubject('');

  subscription;

  // Access Observables through mapped data
  sharedUser = combineLatest([this.userId.asObservable(),
                             this.username.asObservable(),
                             this.role.asObservable(),
                             this.organizationId.asObservable(),
                             this.organization.asObservable()])
                             .pipe(map(([userId, username, role, orgId, org]) => {
                                return {
                                  userId: this.userId.value,
                                  username: this.username.value,
                                  role: this.role.value,
                                  orgId: this.organizationId.value,
                                  org: this.organization.value
                                };
                             }), debounceTime(0));

  constructor(private http: HttpClient) { // We inject the http client in the constructor to do our REST operations
    if (localStorage.getItem('id') !== '') {
        this.subscription = this.getCurrentUser(localStorage.getItem('id'))
          .subscribe((data) => {
            this.userId.next(data.user_id);
            this.username.next(data.user_name);
            this.role.next(data.role);
            this.organizationId.next(data.organization_id);
            this.organization.next(data.organization_name);
          });
    }
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

  private setNext(nextUserId: any, nextUser: any, nextRole: any, nextOrgId: any, nextOrg: any): void {
      this.userId.next(nextUserId);
      this.username.next(nextUser);
      this.role.next(nextRole);
      this.organizationId.next(nextOrgId);
      this.organization.next(nextOrg);

      localStorage.setItem('id', nextUserId);
  }

  setLogin(loggedInUserId: any, loggedInUser: any, loggedInRole: any, loggedInOrgId: any, loggedInOrg: any): void {
     this.setNext(loggedInUserId, loggedInUser, loggedInRole, loggedInOrgId, loggedInOrg);
  }

  setLogOut(): void {
    this.setNext('', '', '', '', '');
  }

  OnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
