import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class ManageAuditsService {

  constructor(private http: HttpClient) {}

  createAudit(inventoryItem: object): Observable<any> {
    return this.http.post(`${BASEURL}/audit/`, inventoryItem);
  }

  assignSK(assignedSK: object, auditId: Number): Observable<any> {
    return this.http.patch(`${BASEURL}/audit/${auditId}/`, assignedSK);
  }

  getAuditData(auditId: Number): Observable<any> {
    return this.http.get(`${BASEURL}/audit/${auditId}/`);
  }

  getBusySKs(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/audit/`, {params});
  }

  initiatePreAudit(preAuditData: object): Observable<any> {
    return this.http.post(`${BASEURL}/item-to-sk/`, preAuditData);
  }
}
