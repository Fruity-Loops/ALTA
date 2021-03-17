import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { env } from 'src/environments/environment';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  orgId: string;

  constructor(private http: HttpClient) {
    this.orgId = '';
  }

  getRecommendations(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/recommendation/`, { params });
  }
}
