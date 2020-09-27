import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DemoService {

  base_url = " http://localhost:8000";

  constructor(private http: HttpClient) { }

  getAuthUsers() {
   return this.http.get(this.base_url + "/auth_users/");
  }
}
