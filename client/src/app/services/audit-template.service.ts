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
      this.orgId = localStorage.getItem("organization_id");
      return this.http.post(`${BASEURL}/template/`, { organization: this.orgId, ...templateBody });
  }

  getAuditTemplates(): Observable<any> {
      this.orgId = localStorage.getItem("organization_id");
      return this.http.get(`${BASEURL}/template/`, {params: {organization: this.orgId}});
  }

}
