import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Audit } from 'src/app/models/audit';
import { Observable } from 'rxjs';

const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) { }


  getAudits(): Observable<any> {
    return this.http.get<Audit[]>(`${BASEURL}/audits`)
  }
}
