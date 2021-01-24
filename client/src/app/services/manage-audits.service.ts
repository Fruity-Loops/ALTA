import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class ManageAuditsService {
  //orgId: string;
  constructor(private http: HttpClient) {}

  createAudit(inventoryItem): Observable<any> {
    return this.http.post(`${BASEURL}/audit/`, inventoryItem);
  }

  assignSK(assignedSK, auditId): Observable<any> {
    return this.http.patch(`${BASEURL}/audit/${auditId}/`, assignedSK);
  }

  getAuditData(auditId): Observable<any> {
    return this.http.get(`${BASEURL}/audit/${auditId}/`);
  }

  getBusySKs(params): Observable<any> {

    console.log(params);

    return this.http.get(`${BASEURL}/audit/`, {params} );
  }

  initiatePreAudit(preAuditData): Observable<any> {
    return this.http.post(`${BASEURL}/item-to-sk/`, preAuditData);
  }
}
