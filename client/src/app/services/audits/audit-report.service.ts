import {env} from "../../../environments/environment";
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import { LocalStorageInterface} from "../LocalStorage.interface";

const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuditReportService implements LocalStorageInterface {

  constructor(private http: HttpClient) { }

  updateLocalStorage(storageId: AuditLocalStorage, value: any): void {
    localStorage.setItem(storageId, value);
  }

  getLocalStorage(storageId: AuditLocalStorage): any {
    return localStorage.getItem(storageId);
  }

  removeFromLocalStorage(storageId: AuditLocalStorage): void {
    localStorage.removeItem(storageId);
  }

  getAuditData(id: number): Observable<any> {
    return this.http.get(`${BASEURL}/audit/${id}/`);
  }

  getProperAudits(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/audit/proper_audits/`, {params});
  }

  getComments(): Observable<any> {
    return this.http.get(`${BASEURL}/comment/`);
  }

  postComment(comment: any): Observable<any> {
    return this.http.post(`${BASEURL}/comment/`, {comment});
  }

}

export enum AuditLocalStorage {
  AuditId = 'audit_id'
}
