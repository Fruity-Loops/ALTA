import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { errorHandler } from 'src/app/services/error-handler';
import { map, mergeMap } from 'rxjs/operators';

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

  getBinSKAudit(userID, auditID): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/`, {
      params: {
        customuser_id: userID,
        init_audit_id: auditID,
      }
    })
      .pipe(catchError(errorHandler));
  }

  getBins(userID, auditID): Observable<any> {
    return this.getBinSKAudit(userID, auditID)
      .pipe(
        map(res => {
          res.map(bin => bin.item_ids = JSON.parse(bin.item_ids));
          return res;
        }),
      );
  }

  getBin(userID, auditID, binID): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/`, {
      params: {
        customuser_id: userID,
        init_audit_id: auditID,
        bin_id: binID,
      }
    })
      .pipe(catchError(errorHandler));
  }

  checkItem(userID, auditID, binID, itemID){
    return this.http.get(`${BASEURL}/audit/check_item/`, {
      params: {
        customuser_id: userID,
        audit_id: auditID,
        bin_id: binID,
        item_id: itemID
      }
    })
      .pipe(catchError(errorHandler));
  }

  getItems(userID, auditID, binID){
    return this.http.get(`${BASEURL}/bin-to-sk/items/`, {
      params: {
        customuser_id: userID,
        audit_id: auditID,
        bin_id: binID,
      }
    })
      .pipe(catchError(errorHandler));
  }

  validate(record){
    return this.http.post(`${BASEURL}/record/`, record)
      .pipe(catchError(errorHandler));
  }
}
