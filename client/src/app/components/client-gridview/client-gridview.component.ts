import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-client-gridview',
  templateUrl: './client-gridview.component.html',
  styleUrls: ['./client-gridview.component.css']
})

export class ClientGridviewComponent implements OnInit {
  users: User[] = [];
  display: boolean;
  view = 'Client Gridview';

  constructor() {
    this.display = false;
  }

  ngOnInit(): void {
  }
}
