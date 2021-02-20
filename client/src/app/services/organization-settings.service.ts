import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {env} from "../../environments/environment";


// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class OrganizationSettingsService {

  constructor(private http: HttpClient) { }

  updateRefreshItemsTime(body: object): Observable<any> {
    return this.http.post(`${BASEURL}/InventoryItemRefreshTime/`, body);
  }
}
