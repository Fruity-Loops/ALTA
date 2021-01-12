import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {env} from 'src/environments/environment';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuditTemplateService {
  orgId: string;

  constructor(private http: HttpClient) {  }

  createTemplate(templateBody): Observable<any> {
      this.orgId = localStorage.getItem('organization_id');
      // tslint:disable-next-line
      return this.http.post(`${BASEURL}/template/`, { organization: parseInt(this.orgId), ...templateBody });
  }

  getAuditTemplates(): Observable<any> {
      this.orgId = localStorage.getItem('organization_id');
      return this.http.get(`${BASEURL}/template/`, {params: {organization: this.orgId}});
  }

  getATemplate(id): Observable<any> {
    return this.http.get(`${BASEURL}/template/${id}/`);
  }

  updateTemplate(id, template): Observable<any> {
    return this.http.patch(`${BASEURL}/template/${id}/`, template);
  }

  deleteTemplate(id): Observable<any> {
    return this.http.delete(`${BASEURL}/template/${id}/`);
  }

}
