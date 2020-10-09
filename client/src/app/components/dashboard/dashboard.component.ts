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
  // tells whether to display the modify client role component
  display: boolean;

  constructor() { }

  ngOnInit(): void {
    this.selectedOption = this.options[0];
    this.display = false;
  }

  // When clicked the last chosen option is updated
  onSelect(option: DashboardOption): void {
    this.selectedOption = option;
    if (this.selectedOption.title == 'Modify Client Role')
    {
      this.display = !this.display;
    }
  }
}
