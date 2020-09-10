import { Component, OnInit } from '@angular/core';
import { DemoService } from './demo.service'

@Component({
  selector: 'app-demo',
  templateUrl: './demo.component.html',
  styleUrls: ['./demo.component.css']
})
export class DemoComponent implements OnInit {
  component_name :string;
  users: string[];
  service;

  constructor(service: DemoService) {
    this.service = service; 
    this.component_name = "Authenticated Users";
    this.showAuthUsers();
   }

  ngOnInit(): void {
  }

  showAuthUsers() {
   this.service.getAuthUsers()
     .subscribe((data) => {
      this.users = data.map(JSON.stringify)
    });
  }
}
