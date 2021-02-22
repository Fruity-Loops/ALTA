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

  getAudits(userID, org): Observable<any> {
    return this.http.get(`${BASEURL}/audit/`,
      {
        params: {
          assigned_sk: userID,
          organization: org
        }
      })
      .pipe(catchError(errorHandler));
  }

  getBinSKAudit(userID, auditID, binStatus): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/`, {
      params: {
        customuser_id: userID,
        init_audit_id: auditID,
        status: binStatus
      }
    })
      .pipe(catchError(errorHandler));
  }

  getBins(userID, auditID, binStatus): Observable<any> {
    return this.getBinSKAudit(userID, auditID, binStatus)
      .pipe(
        map(res => {
          res.map(bin => bin.item_ids = JSON.parse(bin.item_ids.replaceAll('\'', '\"')));
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


  completeBin(userID, auditID, binID, binStatus): Observable<any> {
    return this.http.patch(`${BASEURL}/bin-to-sk/${binID}/`, {
      customuser_id: userID,
      init_audit_id: auditID,
      status: binStatus
    })
      .pipe(catchError(errorHandler));
  }

  getItem(userID, auditID, binID, itemID) {
    return this.http.get(`${BASEURL}/audit/record/check_item/`, {
      params: {
        customuser_id: userID,
        audit_id: auditID,
        bin_id: binID,
        item_id: itemID
      }
    })
      .pipe(catchError(errorHandler));
  }

  getItems(userID, auditID, binID) {
    return this.http.get(`${BASEURL}/audit/bin-to-sk/items/`, {
      params: {
        customuser_id: userID,
        audit_id: auditID,
        bin_id: binID,
      }
    })
      .pipe(catchError(errorHandler));
  }


  getCompletedItemsBin(userID, auditID, binID) {
    return this.http.get(`${BASEURL}/audit/record/completed_items/`, {
      params: {
        customuser_id: userID,
        audit_id: auditID,
        bin_to_sk: binID,
      }
    })
      .pipe(catchError(errorHandler));
  }

  getRecord(userID, auditID, binID, recordID) {
    return this.http.get(`${BASEURL}/record/${recordID}/`,
      {
        params: {
          customuser_id: userID,
          audit_id: auditID,
          bin_id: binID,
        }
      })
      .pipe(catchError(errorHandler));
  }

  patchRecord(recordID, recordData) {
    return this.http.patch(`${BASEURL}/record/${recordID}/`, recordData)
      .pipe(catchError(errorHandler));
  }

  createRecord(record) {
    return this.http.post(`${BASEURL}/record/`, record)
      .pipe(catchError(errorHandler));
  }

  deleteRecord(recordID) {
    return this.http.delete(`${BASEURL}/record/${recordID}/`)
      .pipe(catchError(errorHandler));
  }

  getAuditProgressionMetrics(userID, org, auditID): Observable<any> {
    return this.http.get(`${BASEURL}/audit/progression_metrics/`,
      {
        params: {
          assigned_sk: userID,
          organization: org,
          audit_id: auditID
        }
      })
      .pipe(catchError(errorHandler));
  }

  getBinProgressionMetrics(userID, auditID, binID): Observable<any> {
    return this.http.get(`${BASEURL}/bin-to-sk/progression_metrics/`,
      {
        params: {
          customuser_id: userID,
          audit_id: auditID,
          bin_id: binID,
        }
      })
      .pipe(catchError(errorHandler));
  }
}
