import { Component, OnInit } from '@angular/core';
import { SideNavOption } from './sidenavOption';
import { AuthService } from 'src/app/services/auth.service';
import { SystemNavListings, OrganizationNavListings } from './sidenavListing';
import {NavigationEnd, NavigationStart, Router} from '@angular/router';
import { TokenService } from '../../services/token.service';
import roles from '../../fixtures/roles.json';
import { routes } from '../../modules/alta-main-routing/alta-main-routing.module';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SideNavComponent implements OnInit {
  // contains the listing of all sidenav menu items
  options = SystemNavListings;
  // contains the last option chosen, it defaults to the first
  // TODO: selectedOption has no initializer in the constructor
  // @ts-ignore
  selectedOption: SideNavOption;

  authSubscription: any;
  routeSubscription: any;
  loggedInUser: string;
  loggedInUserRole: string;

  constructor(
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService
    ) {

    // TODO: what strings should be assigned by default
    //  which wouldn't hinder our security
    this.loggedInUser = '';
    this.loggedInUserRole = '';
  }

  ngOnInit(): void {
    this.authSubscription = this.authService.getOrgMode().subscribe(orgMode => {
      if (orgMode) {
        this.options = OrganizationNavListings;
      } else {
        this.options = SystemNavListings;
      }
    });
    this.authSubscription = this.authService.sharedUser
      .subscribe((data) => {
        this.loggedInUser = data.username;
        roles.forEach(role => {
          if (role.abbrev === data.role) {
            this.loggedInUserRole = role.name;
          }
        });
      });
    this.setSelected(this.router.url);
    this.subscribeSelected();
  }

  exitOrg(): void {
    this.authService.turnOffOrgMode();
  }

  logout(): void {
    this.tokenService.DeleteToken(); // Delete token when user logout
    this.authService.setLogOut();   // Extra step - sets the sharedUser data to ''
    this.router.navigate(['login']); // Redirect user to login/register pager
    // TODO: Check out if we want to delete also the token from the db, in order to regenerate a new one while logging in
  }

  subscribeSelected(): void {
    this.routeSubscription = this.router.events.subscribe(value => {
      if (value instanceof NavigationEnd) {
        this.setSelected(value.url);
      }
      if (value instanceof NavigationStart && value.navigationTrigger === 'popstate') {
        const inNavOptions = this.checkInSelection(value.url);
        if (!inNavOptions) {
          if (this.authService.getOrgMode().getValue()) {
            this.authService.setOrgMode(false);
            this.options = SystemNavListings;
          } else {
            this.authService.setOrgMode(true);
            this.options = OrganizationNavListings;
          }
        }
      }
    });

  }

  setSelected(url: string): void {
    if (url === '/create-members') {
      if (this.options === SystemNavListings) {
        // @ts-ignore
        // TODO: should there be a default url if routes[] is undefined?
        // NOTICE: url changes types from string to Route
        url = routes[0].children[4]; // '/sa-modify-members';
      }
      else if (this.options === OrganizationNavListings) {
        // @ts-ignore
        // TODO: should there be a default url if routes[] is undefined?
        // NOTICE: url changes types from string to Route
        url = routes[0].children[3]; // '/modify-members';
      }

    }


    this.options.forEach(navOption => {
      if ('/' + navOption.routerLink === url) {
        this.selectedOption = navOption;
        return;
      }
    });
  }

  checkInSelection(url: string): boolean {
    let found = false;
    this.options.forEach(navOption => {
      if ('/' + navOption.routerLink === url) {
        found = true;
      }
    });
    return found;
  }

  onDestroy(): void {
    this.authSubscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }
}
