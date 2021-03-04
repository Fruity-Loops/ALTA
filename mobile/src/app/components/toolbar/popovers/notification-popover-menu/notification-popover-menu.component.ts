import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-popover-menu',
  templateUrl: './notification-popover-menu.component.html',
  styleUrls: ['./notification-popover-menu.component.scss'],
  providers: [NavParams],
})
export class NotificationPopoverMenuComponent implements OnInit {
  notificationData: any;

  constructor(
    private router: Router,
    public navParams: NavParams,
    private popoverController: PopoverController,
  ) {
    this.notificationData = this.navParams.get('notificationData');
  }

  ngOnInit() { }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

  handleNotificationClick(id){
    this.dismissPopover();
    this.router.navigateByUrl(`/audits/${id}`, { replaceUrl: false });
  }

}
