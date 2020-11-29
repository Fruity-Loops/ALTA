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

  getPageItems(page) : Observable<any> {
    if(page === '') {
      return this.http.get(`${BASEURL}/item/?page=1`);
    }
    else {
      return this.http.get(page);
    }
  }

}
