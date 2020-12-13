import { env } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})
export class ManageInventoryItemsService {
  constructor(private http: HttpClient) {}

  getPageItems(page, pageSize): Observable<any> {
    let test = ""
    let params = new HttpParams();
    params = params.append('test', test);
    console.log(params);
    params = params.append('page', page);
    params = params.append('page_size', pageSize);
    console.log(params);
    params = params.append('page', page);
    return this.http.get(`${BASEURL}/item/`, {params: params});
    // /?page=${page}&page_size=${pageSize}`);
  }

  updateRefreshItemsTime(body): Observable<any> {
    return this.http.post(`${BASEURL}/InventoryItemRefreshTime/`, body);
  }
}
