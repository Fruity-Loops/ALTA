import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';
import { TokenService } from 'src/app/services/token.service';
import { CurrentUserService } from 'src/app/services/current-user.service';

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
    private currentUser: CurrentUserService
  ) {}

  isVisible = true;
  @Output() drawerEvent = new EventEmitter<boolean>();
  organization;
  loggedInUser;
  loggedInUserRole;
  subscription;

  ngOnInit(): void {
    this.subscription = this.currentUser.sharedUser
      .subscribe((data) => {
          this.loggedInUser = data.username;
          this.loggedInUserRole = data.role;
          this.organization = data.org;
      });
  }

  logout(): void {
    this.tokenService.DeleteToken(); // Delete token when user logout
    this.currentUser.setLogOut();   // Extra step - sets the sharedUser data to an Invalid
    this.router.navigate(['login']); // Redirect user to login/register pager
    // TODO: Check out if we want to delete also the token from the db, in order to regenerate a new one while logging in
  }

  toggleDrawer(): void {
    this.sidenav.toggle();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
