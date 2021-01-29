import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {SidenavService} from 'src/app/services/sidenav.service';
import {AuthService} from 'src/app/services/auth.service';

// TODO: remove
// import {Router} from '@angular/router';
// import {TokenService} from 'src/app/services/token.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

  isVisible = true;
  @Output() drawerEvent = new EventEmitter<boolean>();
  organization: string;
  loggedInUser: string;
  loggedInUserRole: string;
  subscription: any;
  orgModeSub: any;

  orgMode: boolean;

  constructor(
    // TODO: remove
    // private tokenService: TokenService,
    // private router: Router,

    private sidenav: SidenavService,
    private authService: AuthService
  ) {
    this.orgMode = false;

    // TODO: what strings should be assigned by default
    //  which wouldn't hinder our security
    this.organization = '';
    this.loggedInUser = '';
    this.loggedInUserRole = '';
  }

  ngOnInit(): void {
    this.subscription = this.authService.sharedUser.subscribe((data) => {
      this.loggedInUser = data.username;
      this.loggedInUserRole = data.role;
      this.organization = data.org;
    });
    this.orgModeSub = this.authService.getOrgMode().subscribe((value) => {
      this.orgMode = value;
    });
  }

  toggleDrawer(): void {
    this.sidenav.toggle();
  }

  OnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
