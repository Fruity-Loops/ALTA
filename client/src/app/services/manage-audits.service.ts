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

  createAudit(audit: object): Observable<any> {
    return this.http.post(`${BASEURL}/audit/`, audit);
  }

  deleteAudit(auditId: number): Observable<any> {
    return this.http.delete(`${BASEURL}/audit/${auditId}/`);
  }

  assignSK(assignedSK: object, auditId: number): Observable<any> {
    return this.http.patch(`${BASEURL}/audit/${auditId}/`, assignedSK);
  }

  getAuditData(auditId: number): Observable<any> {
    return this.http.get(`${BASEURL}/audit/${auditId}/`);
  }

  getBusySKs(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/audit/`, {params});
  }

  initiatePreAudit(preAuditData: any): Observable<any> {
    return this.http.post(`${BASEURL}/bin-to-sk/`, preAuditData);
  }

  getAssignedBins(auditId: any): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/`, {params: {init_audit_id: auditId}});
  }

  getPreAudit(): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/`);
  }

  deletePreAudit(id: any): Observable<any> {
    return this.http.delete(`${BASEURL}/bin-to-sk/${id}/`);
  }

}
