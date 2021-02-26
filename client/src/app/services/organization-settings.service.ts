import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
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
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data; charset=utf-8');
    return this.http.post(`${BASEURL}/InventoryItemRefreshTime/`, body, {headers: headers});
  }

  updateFTPLocation(body: object): Observable<any> {
    return this.http.post(`${BASEURL}/FTPLocation/`, body);
  }
}
