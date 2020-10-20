import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavService } from 'src/app/services/sidenav.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'],
})
export class ToolbarComponent implements OnInit {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private sidenav: SidenavService
  ) { }

  isVisible = true;
  @Output() drawerEvent = new EventEmitter<boolean>();

  ngOnInit(): void { }

  logout(): void {
    this.tokenService.DeleteToken(); // Delete token when user logout
    this.router.navigate(['login']); // Redirect user to login/register pager

    // TODO: Check out if we want to delete also the token from the db, in order to regenerate a new one while logging in
  }

  toggleDrawer(): void {
    this.sidenav.toggle();
  }
}
