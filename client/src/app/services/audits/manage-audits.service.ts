import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageInterface } from '../LocalStorage.interface';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class ManageAuditsService implements LocalStorageInterface {
  constructor(private http: HttpClient) {}

  updateLocalStorage(storageId: AuditLocalStorage, value: any): void {
    localStorage.setItem(storageId, value);
  }

  getLocalStorage(storageId: AuditLocalStorage): any {
    return localStorage.getItem(storageId);
  }

  removeFromLocalStorage(storageId: AuditLocalStorage): void {
    localStorage.removeItem(storageId);
  }

  createAudit(inventoryItem: object): Observable<any> {
    return this.http.post(`${BASEURL}/audit/`, inventoryItem);
  }

  deleteAudit(auditId: number): Observable<any> {
    return this.http.delete(`${BASEURL}/audit/${auditId}/`);
  }

  assignSK(assignedSK: object, auditId: number): Observable<any> {
    return this.http.patch(`${BASEURL}/audit/${auditId}/`, assignedSK);
  }

  createAuditAssignments(assignments: object): Observable<any> {
    return this.http.post(`${BASEURL}/audit/assignment/`, assignments);
  }

  getAuditData(auditId: number): Observable<any> {
    return this.http.get(`${BASEURL}/audit/${auditId}/`);
  }

  getBusySKs(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/audit/`, { params });
  }

  initiatePreAudit(preAuditData: any): Observable<any> {
    return this.http.post(`${BASEURL}/bin-to-sk/`, preAuditData);
  }

  updatePreAudit(auditId: any, preAuditData: any): Observable<any> {
    return this.http.patch(`${BASEURL}/bin-to-sk/${auditId}/`, preAuditData);
  }

  getAssignedBins(auditId: any): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/`, {
      params: { init_audit_id: auditId },
    });
  }

  deletePreAudit(id: any): Observable<any> {
    return this.http.delete(`${BASEURL}/bin-to-sk/${id}/`);
  }

  getProperAudits(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/audit/proper_audits/`, { params });
  }

  getInsights(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/insights/`, { params });
  }

  getCompleteAudit(auditId: any): Observable<any> {
    let params = new HttpParams();
     params = params.append('organization', String(localStorage.getItem('organization_id')))
                    .append('audit_id', String(auditId));

    return this.http.get(`${BASEURL}/record/`, {params});
  }
}

export enum AuditLocalStorage {
  AuditId = 'audit_id',
}
