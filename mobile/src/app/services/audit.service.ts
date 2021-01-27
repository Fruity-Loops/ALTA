import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { errorHandler } from 'src/app/services/error-handler';

const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor(private http: HttpClient) { }

  getAudits(assigned_sk_id): Observable<any> {
    return this.http.get(`${BASEURL}/audit/`,
      {
        params: {
          assigned_sk: assigned_sk_id,
        }
      })
      .pipe(catchError(errorHandler));
  }
}
