import { Component, OnInit } from '@angular/core';
import { SideNavOption } from './sidenavOption';
import { SideNavListings } from './sidenavListing';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
  // contains the listing of all sidenav menu items
  options = SideNavListings;
  // contains the last option chosen, it defaults to the first
  selectedOption: SideNavOption;
  currentRole;
  subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.selectedOption = this.options[0];

    this.subscription = this.authService.sharedUser
      .subscribe((data) => {
        this.currentRole = data.role;
      });
  }

  OnDestroy() {
    this.subscription.unsubscribe();
  }
}
