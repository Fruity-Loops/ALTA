import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { errorHandler } from 'src/app/services/error-handler';
import { map } from 'rxjs/operators';

const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) { }

  getAudits(userID): Observable<any> {
    return this.http.get(`${BASEURL}/audit/`,
      {
        params: {
          assigned_sk: userID,
        }
      })
      .pipe(catchError(errorHandler));
  }

  getItemSKAudit(userID, auditID): Observable<any> {
    return this.http.get(`${BASEURL}/item-to-sk/`, {
      params: {
        customuser_id: userID,
        init_audit_id: auditID,
      }
    })
      .pipe(catchError(errorHandler));
  }

  getBins(userID, auditID): Observable<any> {
    return this.getItemSKAudit(userID, auditID)
      .pipe(
        map(res => {
          const bins = res[0].bins.split('\'').join('\"');
          return JSON.parse(bins);
        }),
      );
  }
}
