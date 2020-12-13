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

  constructor(private http: HttpClient) { }

  createTemplate(templateBody): Observable<any> {
      return this.http.post(`${BASEURL}/template/`, templateBody);
  }

  getAuditTemplates(): Observable<any> {
      return this.http.get(`${BASEURL}/template/`);
  }

}
