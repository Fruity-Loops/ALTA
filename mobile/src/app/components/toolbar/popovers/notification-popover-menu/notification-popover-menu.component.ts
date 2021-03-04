import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-notification-popover-menu',
  templateUrl: './notification-popover-menu.component.html',
  styleUrls: ['./notification-popover-menu.component.scss'],
  providers: [NavParams],
})
export class NotificationPopoverMenuComponent implements OnInit {
  notificationData: any;

  constructor(
    public navParams: NavParams,
    private popoverController: PopoverController,
  ) {
    this.notificationData = this.navParams.get('notificationData');
  }

  ngOnInit() { }

  async dismissPopover() {
    await this.popoverController.dismiss();
  }

}
