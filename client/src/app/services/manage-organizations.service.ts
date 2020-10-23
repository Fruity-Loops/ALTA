import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = 'http://localhost:8000';

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
    const body = { org_name: organization.org_name };
    return this.http.put(`${BASEURL}/organization/${organization.org_id}/`, body);
  }

  createOrganization(organization): Observable<any> {
    const body = { org_name: organization.org_name };
    return this.http.post(`${BASEURL}/organization/`, body);
  }

  deleteOrganization(id): Observable<any> {
    return this.http.delete(`${BASEURL}/organization/${id}/`);
  }
}
