import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {env} from 'src/environments/environment';
import {Template} from "../components/audit-template/Template";

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuditTemplateService {
  orgId: string;

  constructor(private http: HttpClient) {
    this.orgId = '';
  }

  getOrgId(): void{
    let orgId = localStorage.getItem('organization_id');
    if(orgId){
      this.orgId = orgId;
    } else {
      this.orgId = '';
    }
  }

  createTemplate(templateBody: Template): Observable<any> {
    this.getOrgId();
    // tslint:disable-next-line
    return this.http.post(`${BASEURL}/template/`, { organization: parseInt(this.orgId), ...templateBody });
  }

  getAuditTemplates(): Observable<any> {
    this.getOrgId();
    return this.http.get(`${BASEURL}/template/`, {params: {organization: this.orgId}});
  }

  getATemplate(id: string): Observable<any> {
    return this.http.get(`${BASEURL}/template/${id}/`);
  }

  updateTemplate(id: string, template: Template): Observable<any> {
    return this.http.patch(`${BASEURL}/template/${id}/`, template);
  }

  deleteTemplate(id: string): Observable<any> {
    return this.http.delete(`${BASEURL}/template/${id}/`);
  }

}
