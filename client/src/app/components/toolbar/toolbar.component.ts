import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {SidenavService} from 'src/app/services/sidenav.service';
import {AuthService} from 'src/app/services/auth.service';
import {TokenService} from 'src/app/services/token.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private sidenav: SidenavService,
    private authService: AuthService
  ) {
  }

  isVisible = true;
  @Output() drawerEvent = new EventEmitter<boolean>();
  organization;
  loggedInUser;
  loggedInUserRole;
  subscription;
  orgModeSub;

  orgMode: boolean;

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
