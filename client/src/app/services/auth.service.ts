import { env } from 'src/environments/environment';
import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { Router } from '@angular/router';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private userId = new BehaviorSubject('');
  private username = new BehaviorSubject('');
  private role = new BehaviorSubject('');
  private organizationId = new BehaviorSubject('');
  private organization = new BehaviorSubject('');

  orgMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!localStorage.getItem('organization_id'));

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

  constructor(
    private http: HttpClient, // We inject the http client in the constructor to do our REST operations
    private router: Router) {
    if (localStorage.getItem('id')) {
      this.subscription = this.getCurrentUser(localStorage.getItem('id'))
        .subscribe((data) => {
          this.userId.next(data.user_id);
          this.username.next(data.user_name);
          this.role.next(data.role);
          this.organizationId.next(data.organization);
          this.organization.next(localStorage.getItem('organization'));
          // TODO: update GET call to return organization's name
          if (data.role === 'IM') {
            this.turnOnOrgMode({ organization_name: localStorage.getItem('organization'), ...data }, false);
          }
        });
    }
  }

  getOrgMode(): BehaviorSubject<boolean> {
    return this.orgMode;
  }

  setOrgMode(state: boolean): void {
    this.orgMode.next(state);
  }

  turnOnOrgMode(org, doNavigate): void {
    localStorage.setItem('organization_id', org.organization);
    localStorage.setItem('organization', org.organization_name);
    this.organization.next(org.organization_name);
    this.orgMode.next(true);
    if (doNavigate) {
      this.router.navigate(['dashboard']);
    }
  }

  turnOffOrgMode(): void {
    if (this.role.getValue() === 'SA') {
      localStorage.removeItem('organization_id');
      this.router.navigate(['manage-organizations']);
      this.orgMode.next(false);
      this.organization.next('');
    } else {
      this.router.navigate(['dashboard']);
    }

  }

  register(body): Observable<any> {
    return this.http.post(`${BASEURL}/user/`, {fields_to_save: body});
  }

  getCurrentUser(id): Observable<any> {
    let return_fields = ["id", "user_name", "first_name", "last_name", "email", "organization", "role", "location", "is_active"];
    return this.http.get(`${BASEURL}/user/${id}/`, {params: {"fields_to_return": return_fields}});
  }

  openRegister(body): Observable<any> {
    return this.http.post(`${BASEURL}/open-registration/`, {fields_to_save: body});
  }

  login(body): Observable<any> {
    return this.http.post(`${BASEURL}/login/`, body);
  }

  loginMobile(body): Observable<any> {
    return this.http.post(`${BASEURL}/login-mobile/`, body);
  }

  setNext(nextUserId: any, nextUser: any, nextRole: any, nextOrgId: any, nextOrg: any): void {
    this.userId.next(nextUserId);
    this.username.next(nextUser);
    this.role.next(nextRole);
    this.organizationId.next(nextOrgId);
    this.organization.next(nextOrg);

    localStorage.setItem('id', nextUserId);
  }

  setLogOut(): void {
    this.setNext('', '', '', '', '');
    localStorage.removeItem('id');
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    localStorage.removeItem('role');
    localStorage.removeItem('organization');
    localStorage.removeItem('organization_id');
  }

  OnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
