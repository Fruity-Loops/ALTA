import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private username = new BehaviorSubject('');
  private role = new BehaviorSubject('');
  private organization = new BehaviorSubject('');

  //Access Observables through mapped data
  sharedUser = combineLatest(this.username.asObservable(),
                             this.role.asObservable(),
                             this.organization.asObservable())
                             .pipe(map(([username, role, org]) => {
                                return {
                                  username: this.username.value,
                                  role: this.role.value,
                                  org: this.organization.value
                                }
                             }));

  subscription;

  constructor(private http: HttpClient) {

    //Gets the logged in user's username, role, organization from backend
    this.subscription = this.getCurrentRole()
      .subscribe((data) => {
        this.username.next(data.user);
        this.role.next(data.role);
        this.organization.next(data.organization);
      });
  }

  setLogIn(loggedInUser: any,
           loggedInRole: any,
           loggedInOrg: any): void {
      this.username.next(loggedInUser);
      this.role.next(loggedInRole);
      this.organization.next(loggedInOrg);
  }

  setLogOut(): void {
    this.username.next('Invalid');
    this.role.next('Invalid');
    this.organization.next('Invalid');
  }

  getCurrentRole(): Observable<any> {
    return this.http.get<User>(`${BASEURL}/current_role/`);
  }
}
