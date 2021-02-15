import {env} from 'src/environments/environment';
// @ts-ignore
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject, combineLatest} from 'rxjs';
import {map, debounceTime} from 'rxjs/operators';
import {Router} from '@angular/router';

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

  orgMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.getLocalStorage(LocalStorage.OrgId));

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
    if (this.getLocalStorage(LocalStorage.UserID)) {
      this.subscription = this.getCurrentUser(this.getLocalStorage(LocalStorage.UserID) as string)
        .subscribe((data) => {
          this.userId.next(data.user_id);
          this.username.next(data.user_name);
          this.role.next(data.role);
          this.organizationId.next(data.organization);
          this.organization.next(this.getLocalStorage(LocalStorage.OrgName) as string);
          // TODO: update GET call to return organization's name
          if (data.role === 'IM') {
            this.turnOnOrgMode({organization_name: this.getLocalStorage(LocalStorage.OrgName), ...data}, false);
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

  updateLocalStorage(storageId: LocalStorage, value: any): void {
    localStorage.setItem(storageId, value);
  }

  getLocalStorage(storageId: LocalStorage): string | null {
    return localStorage.getItem(storageId);
  }

  removeFromLocalStorage(storageId: LocalStorage): void {
    localStorage.removeItem(storageId);
  }

  getOrgId = () => this.organizationId.getValue();

  turnOnOrgMode(org: any, doNavigate: boolean): void {
    this.updateLocalStorage(LocalStorage.OrgId, org.organization);
    this.updateLocalStorage(LocalStorage.OrgName, org.organization_name);
    this.organization.next(org.organization_name);
    this.orgMode.next(true);
    if (doNavigate) {
      this.router.navigate(['dashboard']);
    }
  }

  turnOffOrgMode(): void {
    if (this.role.getValue() === 'SA') {
      this.removeFromLocalStorage(LocalStorage.OrgId);
      this.router.navigate(['manage-organizations']);
      this.orgMode.next(false);
      this.organization.next('');
    } else {
      this.router.navigate(['dashboard']);
    }

  }

  register(body: object): Observable<any> {
    return this.http.post(`${BASEURL}/user/`, body);
  }

  getCurrentUser(id: string): Observable<any> {
    return this.http.get(`${BASEURL}/user/${id}/`);
  }

  openRegister(body: object): Observable<any> {
    return this.http.post(`${BASEURL}/open-registration/`, body);
  }

  login(body: object): Observable<any> {
    return this.http.post(`${BASEURL}/login/`, body);
  }

  loginMobile(body: object): Observable<any> {
    return this.http.post(`${BASEURL}/login-mobile/`, body);
  }

  setNext(nextUserId: any, nextUser: any, nextRole: any, nextOrgId: any, nextOrg: any): void {
    this.userId.next(nextUserId);
    this.username.next(nextUser);
    this.role.next(nextRole);
    this.organizationId.next(nextOrgId);
    this.organization.next(nextOrg);

    this.updateLocalStorage(LocalStorage.UserID, nextUserId);
  }

  setLogOut(): void {
    this.setNext('', '', '', '', '');
    this.removeFromLocalStorage(LocalStorage.UserID);
    this.removeFromLocalStorage(LocalStorage.Role);
    this.removeFromLocalStorage(LocalStorage.Role);
    this.removeFromLocalStorage(LocalStorage.OrgName);
    this.removeFromLocalStorage(LocalStorage.OrgId);
  }

  OnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


enum LocalStorage {
  UserID = 'id',
  Role = 'role',
  OrgName = 'organization',
  OrgId = 'organization_id'
}
