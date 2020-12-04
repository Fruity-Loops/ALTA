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

  getPageItems(page, page_size): Observable<any> {
    return this.http.get(
      `${BASEURL}/item/?page=${page}&page_size=${page_size}`
    );
  }

  updateRefreshItemsTime(body): Observable<any> {
    return this.http.post(`${BASEURL}/InventoryItemRefreshTime/`, body);
  }
}
