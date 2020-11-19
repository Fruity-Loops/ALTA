import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class ManageInventoryItemsService {
  constructor(private http: HttpClient) {}

  getAllItems(): Observable<any> {
    return this.http.get(`${BASEURL}/item/`);
  }
}
