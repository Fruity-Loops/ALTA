import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PopoverController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-popover-menu',
  templateUrl: './profile-popover-menu.component.html',
  styleUrls: ['./profile-popover-menu.component.scss'],
})
export class ProfilePopoverMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private popoverController: PopoverController) { }

  ngOnInit() { }

  async logout() {
    this.dismissPopover();
    await this.authService.logout();
    this.router.navigateByUrl('login', { replaceUrl: true });
  }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }
}
