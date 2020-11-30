import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root'
})
export class ManageOrganizationsService {

  constructor(private http: HttpClient) { }

  getAllOrganizations(): Observable<any> {
    return this.http.get(`${BASEURL}/organization/`);
  }

  getOneOrganization(id): Observable<any> {
    return this.http.get(`${BASEURL}/organization/${id}/`);
  }

  updateOrganization(organization): Observable<any> {
    return this.http.patch(`${BASEURL}/organization/${organization.org_id}/`, organization);
  }

  createOrganization(organization): Observable<any> {
    return this.http.post(`${BASEURL}/organization/`, organization);
  }

  deleteOrganization(id): Observable<any> {
    return this.http.delete(`${BASEURL}/organization/${id}/`);
  }
}
