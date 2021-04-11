import {env} from 'src/environments/environment';
// @ts-ignore
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, BehaviorSubject, combineLatest} from 'rxjs';
import {map, debounceTime} from 'rxjs/operators';
import {Router} from '@angular/router';
import {LocalStorageInterface} from '../LocalStorage.interface';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements LocalStorageInterface {

  private observables: any = {};

  orgMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.getLocalStorage(UserLocalStorage.OrgId));

  subscription;

  // Access Observables through mapped data (initialized to an observable here, but initialized actually in constructor)
  sharedUser: Observable<any>;

  constructor(
    private http: HttpClient, // We inject the http client in the constructor to do our REST operations
    public router: Router) {
    this.initializeObservables();
    this.sharedUser = this.getSharedUser();

    if (this.getLocalStorage(UserLocalStorage.UserID)) {
      // @ts-ignore
      this.subscription = this.getCurrentUser(this.getLocalStorage(UserLocalStorage.UserID))
        .subscribe((data) => {
          this.updateLocalStorage(UserLocalStorage.UserID, data.id);
          this.updateLocalStorage(UserLocalStorage.Username, data.user_name);
          this.updateLocalStorage(UserLocalStorage.Role, data.role);
          if (data.organization) {
            this.updateLocalStorage(UserLocalStorage.OrgId, data.organization);
            this.updateLocalStorage(UserLocalStorage.OrgName, this.getLocalStorage(UserLocalStorage.OrgName));
          }
          if (data.role === 'IM') {
            this.turnOnOrgMode({organization_name: this.getLocalStorage(UserLocalStorage.OrgName), ...data}, false);
          }
        });
    }
  }

  initializeObservables(): void {
    // tslint:disable-next-line:forin
    for (const localStorageKey of Object.values(UserLocalStorage)) {
      this.observables[localStorageKey] = new BehaviorSubject('');
    }
  }

  getSharedUser(): Observable<any> {
    return combineLatest([this.observables[UserLocalStorage.UserID].asObservable(),
      this.observables[UserLocalStorage.Username].asObservable(),
      this.observables[UserLocalStorage.Role].asObservable(),
      this.observables[UserLocalStorage.OrgId].asObservable(),
      this.observables[UserLocalStorage.OrgName].asObservable()])
      .pipe(map(([userId, username, role, orgId, org]) => {
        return {
          userId: this.observables[UserLocalStorage.UserID].value,
          username: this.observables[UserLocalStorage.Username].value,
          role: this.observables[UserLocalStorage.Role].value,
          orgId: this.observables[UserLocalStorage.OrgId].value,
          org: this.observables[UserLocalStorage.OrgName].value
        };
      }), debounceTime(0));
  }

  getOrgMode(): BehaviorSubject<boolean> {
    return this.orgMode;
  }

  setOrgMode(state: boolean): void {
    this.orgMode.next(state);
  }

  updateLocalStorage(storageId: UserLocalStorage, value: any): void {
    localStorage.setItem(storageId, value);
    this.observables[storageId].next(value);
  }

  getLocalStorage(storageId: UserLocalStorage): string | null {
    return localStorage.getItem(storageId);
  }

  removeFromLocalStorage(storageId: UserLocalStorage): void {
    localStorage.removeItem(storageId);
    this.observables[storageId].next('');
  }

  turnOnOrgMode(org: any, doNavigate: boolean): void {
    this.updateLocalStorage(UserLocalStorage.OrgId, org.organization);
    this.updateLocalStorage(UserLocalStorage.OrgName, org.organization_name);
    this.orgMode.next(true);
    if (doNavigate) {
      this.router.navigate(['dashboard']);
    }
  }

  turnOffOrgMode(): void {
    if (this.observables[UserLocalStorage.Role].getValue() === 'SA') {
      this.removeFromLocalStorage(UserLocalStorage.OrgId);
      this.removeFromLocalStorage(UserLocalStorage.OrgName);
      this.router.navigate(['manage-organizations']);
      this.orgMode.next(false);
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
    this.updateLocalStorage(UserLocalStorage.UserID, nextUserId);
    this.updateLocalStorage(UserLocalStorage.Username, nextUser);
    this.updateLocalStorage(UserLocalStorage.Role, nextRole);
    this.updateLocalStorage(UserLocalStorage.OrgId, nextOrgId);
    this.updateLocalStorage(UserLocalStorage.OrgName, nextOrg);
  }

  setLogOut(): void {
    this.setNext('', '', '', '', '');
    this.removeFromLocalStorage(UserLocalStorage.UserID);
    this.removeFromLocalStorage(UserLocalStorage.Role);
    this.removeFromLocalStorage(UserLocalStorage.Username);
    this.removeFromLocalStorage(UserLocalStorage.OrgName);
    this.removeFromLocalStorage(UserLocalStorage.OrgId);
  }

  OnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}


export enum UserLocalStorage {
  UserID = 'id',
  Role = 'role',
  OrgName = 'organization',
  OrgId = 'organization_id',
  Username = 'username'
}
