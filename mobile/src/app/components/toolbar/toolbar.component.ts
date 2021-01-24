import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { ProfilePopoverMenuComponent } from 'src/app/components/toolbar/popovers/profile-popover-menu/profile-popover-menu.component';
import { NotificationPopoverMenuComponent } from 'src/app/components/toolbar/popovers/notification-popover-menu/notification-popover-menu.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(
    public popoverController: PopoverController
    ) { }

  ngOnInit() { }

  async presentProfilePopover(ev: any) {
    const popover = await this.popoverController.create({
      component: ProfilePopoverMenuComponent,
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }

  async presentNotificationPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: NotificationPopoverMenuComponent,
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }

}
