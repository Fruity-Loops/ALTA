import { Component, OnInit } from '@angular/core';
import { DashboardOption } from './dashboardOption';
import { DashboardListings } from './dashboardListing';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // contains the listing of all dashboard options
  options = DashboardListings;
  // contains the last option chosen, it defaults to the first
  selectedOption: DashboardOption;

  constructor() { }

  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }

  // When clicked the last chosen option is updated
  onSelect(option: DashboardOption): void {
    this.selectedOption = option;
  }
}
