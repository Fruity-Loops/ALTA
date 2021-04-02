import {env} from 'src/environments/environment';
import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';

// Connection with the backend
const BASEURL = env.api_root;

@Injectable({
  providedIn: 'root',
})

export class ManageInventoryItemsService {
  constructor(private http: HttpClient) {
  }

  getPageItems(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/item/`, {params});
  }

  getTemplateItems(params: HttpParams): Observable<any> {
    return this.http.get(`${BASEURL}/item/template/`, {params});
  }
}
