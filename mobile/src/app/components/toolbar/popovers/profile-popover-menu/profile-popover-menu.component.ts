import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-popover-menu',
  templateUrl: './profile-popover-menu.component.html',
  styleUrls: ['./profile-popover-menu.component.scss'],
  providers: [NavParams],
})
export class ProfilePopoverMenuComponent implements OnInit {
  loggedInUser: string;

  constructor(
    private router: Router,
    public navParams: NavParams,
    private authService: AuthService,
    private popoverController: PopoverController) {

    this.loggedInUser = this.navParams.get('loggedInUser');
  }

  ngOnInit() { }

  async logout() {
    this.dismissPopover();
    await this.authService.logout();
    this.router.navigateByUrl('signin', { replaceUrl: true });
  }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

  navigate(){
    this.dismissPopover();
    this.router.navigateByUrl('/settings', { replaceUrl: false });
  }

}
