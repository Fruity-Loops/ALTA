import { Component, OnInit } from '@angular/core';
import { DashboardOption } from '../dashboardOption';
import { DashboardListings } from '../dashboardListing';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  options = DashboardListings;

  constructor() { }

  ngOnInit(): void {
  }

}
