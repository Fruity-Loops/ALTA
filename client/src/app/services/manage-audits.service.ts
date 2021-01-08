import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class ManageAuditsService {
  constructor(private http: HttpClient) {}

  createAudit(inventoryItem): Observable<any> {
    return this.http.post(`${BASEURL}/audit/`, inventoryItem);
  }
}
