import { Component, OnInit } from '@angular/core';
import { SideNavOption } from './sidenavOption';
import { SideNavListings } from './sidenavListing';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SideNavComponent implements OnInit {
  // contains the listing of all sidenav menu items
  options = SideNavListings;
  // contains the last option chosen, it defaults to the first
  selectedOption: SideNavOption;

  constructor() { }

  ngOnInit(): void {
    this.selectedOption = this.options[0];
  }
}
